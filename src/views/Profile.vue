<template>
  <form class="form-widget row flex flex-center" @submit.prevent="updateProfile">
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="store.user.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website" >Last name</label>
      <input id="website" type="website" v-model="website" />
    </div>
    <div>
      <label for="money">Available Money</label>
      <input id="money" type="money" v-model="money" disabled/>
    </div>

    <div class="flex-end">
      <input
        type="submit"
        class="button block primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div class="flex-end">
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { onMounted, ref } from "vue"
import router from "@/router"

export default {
  setup() {
    const loading = ref(true)
    const username = ref("Loading...")
    const website = ref("Loading...")
    const avatar_url = ref("")
    const money = ref("Loading...")

    async function getProfile() {
      try {
        loading.value = true
        store.user = supabase.auth.user()

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`id, first_name, last_name, money`)
          .eq("id", store.user.id)
          .single()

        if (error && status !== 406) throw error

        if (data) {
          username.value = data.first_name
          website.value = data.last_name
          money.value = "$" + data.money

        }
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    async function updateProfile() {
      try {
        loading.value = true
        store.user = supabase.auth.user()

        const updates = {
          id: store.user.id,
          first_name: username.value,
          last_name: website.value,
          updated_at: new Date(),
        }

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        })

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    async function signOut() {
      try {
        loading.value = true
        let { error } = await supabase.auth.signOut()

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
        router.push('/login')
      }
    }

    onMounted(() => {
      getProfile()
    })

    return {
      store,
      loading,
      username,
      website,
      avatar_url,
      money,

      updateProfile,
      signOut,
    }
  },
}
</script>

<style scoped>
.row {
  padding: 10px;
}

.flex-end {
  margin-top: 24px;
}

button:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>