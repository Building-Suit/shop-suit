<script setup lang="ts">

</script>

<template>
  <h1>hello from index</h1>

  <div class="grid grid-cols-2 gap-2 p-2 w-1/4">
    <Button>No Variant</Button>
    <Button disabled>No Variant disabled</Button>

    <Button variant="secondary">Secondary</Button>
    <Button variant="secondary" disabled>Secondary disabled</Button>

    <Button variant="outline">Outline</Button>
    <Button variant="outline" disabled>Outline disabled</Button>

    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost" disabled>Ghost disabled</Button>

    <Button variant="destructive">Destructive</Button>
    <Button variant="destructive" disabled>Destructive disabled</Button>

    <Button variant="default">Default</Button>
    <Button variant="default" disabled>Default disabled</Button>

    <Button variant="link">Link</Button>
    <Button variant="link" disabled>Link disabled</Button>
  </div>
</template>