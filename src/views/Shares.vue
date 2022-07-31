<template>
    <div class="container">
        <h3 v-if="loading"> Loading... </h3>
         <table>
            <tr>
                <th>Title</th>
                <th>Shares</th>
                <th>Price</th>
            </tr>
            <tr v-for="row in history" :key="row.user_id">
                <td>{{ hist.title }}</td>
                <td>{{ hist.shares }}</td>
                <td>{{ hist.price }}</td>
            </tr>
        </table> 
    </div>
</template>

<script>
import { store } from "../store"
import { onMounted, ref } from "vue"
import { supabase } from "@/supabase"

export default {
    setup () {
        const loading = ref(true);
        const user = supabase.auth.user();

        async function getHistory() {
            try {
                loading.value = true;
                    let { data, error, status } = await supabase
                    .from("history")
                    .select(`user_id, title`)
                    .eq("user_id", user.id)
                    .single()

                    if (error && status !== 406) throw error

                    if (data) {
                    this.history = data
                    }
                } catch (error) {
                    alert(error.message)
                } finally {
                    loading.value = false
            }
        }

        onMounted(() => {
            getHistory()
        })
         
        return {
            loading,
            user,
        }
    },

    data() {
        return {
            history: []
        }
    }
}
</script>

<style scoped>

</style>