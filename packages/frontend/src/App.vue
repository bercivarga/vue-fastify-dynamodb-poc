<script setup lang="ts">
import { onMounted, ref } from "vue";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const allTextiles = ref<{
  textiles: Array<{ id: string; name: string; description: string }>;
}>({ textiles: [] });

const textileName = ref<string>("");
const textileDescription = ref<string>("");

async function fetchAllTextiles() {
  const data = await fetch(`${BACKEND_URL}/textile`);
  const json = await data.json();
  allTextiles.value = json;
}

async function addTextile() {
  try {
    await fetch(`${BACKEND_URL}/textile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: textileName.value,
        description: textileDescription.value,
      }),
    });
  } catch (error) {
    console.error(error);
  } finally {
    textileName.value = "";
    textileDescription.value = "";
    await fetchAllTextiles();
  }
}

async function deleteTextile(id: string) {
  try {
    await fetch(`${BACKEND_URL}/textile/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await fetchAllTextiles();
  }
}

onMounted(async () => {
  await fetchAllTextiles();
});
</script>

<template>
  <h1>Super simple textile editor 🧦</h1>
  <main>
    <div>
      <div>
        <h2>Add a new textile</h2>
        <form>
          <label for="name">Name</label>
          <input
            v-model="textileName"
            type="text"
            id="name"
            name="name"
            required
          />
          <label for="description">Description</label>
          <input
            v-model="textileDescription"
            type="text"
            id="description"
            name="description"
            required
          />
          <button @click.prevent="addTextile">Add</button>
        </form>
      </div>
    </div>

    <div>
      <h2>All textiles</h2>
      <ul>
        <li v-for="textile in allTextiles.textiles" :key="textile.id">
          <strong>Name: {{ textile.name }}</strong>
          <p>Description: {{ textile.description }}</p>
          <button class="delete-btn" @click="deleteTextile(textile.id)">
            Delete
          </button>
        </li>
      </ul>
    </div>
  </main>
  <aside>
    <p>
      This is a simple example app meant to demonstrate a stack using Fastify,
      DynamoDB, Docker, Turborepo, and Vue 3.
    </p>
  </aside>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  max-width: 800px;
  margin: 0 auto;
}

main > div {
  flex: 1;
  width: 100%;
}

main > div:first-child {
  background-color: #c0e1fb;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

main > div:first-child > div > h2 {
  margin-top: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

form > label {
  font-weight: bold;
}

form > input {
  padding: 0.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

ul > li {
  border: 1px solid black;
  padding: 1rem;
}

ul > li:not(:last-child) {
  border-bottom: 1px solid black;
}

.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

aside {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}
</style>
