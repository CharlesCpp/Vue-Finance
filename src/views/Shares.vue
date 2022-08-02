<template>
    <div class="container">
         <table>
            <tr>
                <th v-if="loading"> Loading... </th>
                <th v-else> Title </th>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Time</th>
            </tr>
            <tr v-for="row in history" :key="row.id" >
                <td>{{ row.title }}</td>
                <td>{{ row.symbol }}</td>
                <td>{{ row.shares }}</td>
                <td>${{ row.price }}</td>
                <td>{{ moment(String(row.time)).format('MM/DD/YYYY@hh:mm') }}</td>
            </tr>
        </table> 
    </div>
</template>

<script>
import { store } from "../store"
import { onMounted, ref, reactive } from "vue"
import { supabase } from "@/supabase"
import moment from 'moment'

export default {
    setup () {
        const loading = ref(true);
        const user = supabase.auth.user();
        const history = ref([])


        async function getHistory() {
            try {
                loading.value = true;
                    let { data, error, status } = await supabase
                    .from("history")
                    .select(`id, user_id, title, shares, price, time, symbol`)
                    .eq("user_id", user.id)
                    .order('time')


                    if (error && status !== 406) throw error

                    if (data) {
                    history.value = data
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
            history,
            moment
        }
    },

    computed: {
        logHistory() {
            console.log(this.hist)
        }
    }
}
</script>

<style scoped>

</style>