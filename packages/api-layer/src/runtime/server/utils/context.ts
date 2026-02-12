/**
 * Server-side context utilities
 * Provides cached access to portal and shop context
 */

import { useRuntimeConfig, createError } from "#imports";
import { useApiServer } from "./api-server";
import type { Tables } from "../types/database";
import { getCookie, getHeader } from "#build/types/nitro-imports";

// In-memory cache for server context
const contextCache = new Map<
  string,
  { portal: Tables<"portals"> | null; timestamp: number }
>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get portal by key with caching
 * @example const portal = await getPortalContext('shop-crm')
 */
export const getPortalContext = async (
  portalKey: string,
): Promise<Tables<"portals">> => {
  // Check cache
  const cached = contextCache.get(portalKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.portal) return cached.portal;
  }

  // Fetch from database using PostgREST single row selector
  const { data, error } = await useApiServer<Tables<"portals">>("portals", {
    params: {
      select: "id,key,name,is_active",
      key: `eq.${portalKey}`,
      limit: "1",
    },
    headers: {
      Accept: "application/vnd.pgrst.object+json", // Return single object, not array
    },
  });

  if (error || !data) {
    throw createError({ statusCode: 404, message: "Portal not found" });
  }

  // Cache it
  contextCache.set(portalKey, { portal: data, timestamp: Date.now() });

  return data;
};

/**
 * Get current portal from runtime config (cached)
 */
export const getCurrentPortal = async (): Promise<Tables<"portals">> => {
  const config = useRuntimeConfig();
  const portalKey = config.public.apiLayer.portalKey as string;
  return getPortalContext(portalKey);
};

/**
 * Extract portal_id from request (useful for shop-scoped operations)
 */
export const getPortalId = async (): Promise<string> => {
  const portal = await getCurrentPortal();
  return portal.id;
};

/**
 * Get profile for authenticated user
 */
export const getAuthenticatedProfile = async (
  event: any,
): Promise<Tables<"profiles">> => {
  const token =
    getCookie(event, "sb-access-token") ||
    getHeader(event, "Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  // Get user from Supabase
  const { data: user, error } = await useApiServer<{ id: string }>("user", {
    endpoint: "auth",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error || !user) {
    throw createError({ statusCode: 401, message: "Invalid session" });
  }

  // Get profile (single row)
  const { data: profile } = await useApiServer<Tables<"profiles">>("profiles", {
    params: {
      select: "id,portal_id,display_name,email_snapshot,status",
      user_id: `eq.${user.id}`,
      limit: "1",
    },
    headers: {
      Accept: "application/vnd.pgrst.object+json",
    },
  });

  if (!profile) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  return profile;
};
