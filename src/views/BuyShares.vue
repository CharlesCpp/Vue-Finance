<template>
    <div class="container">
        <form class="form-widget row flex flex-center" @submit.prevent="updateProfile">
            <div>
                <label for="email">Symbol</label>
                <input id="email" type="text" placeholder="Symbol (ex: USD)"/>
            </div>

            <div class="flex-end">
            <input
                type="submit"
                class="button block primary"
                :value="loading ? 'Loading ...' : 'Search...'"
                :disabled="loading"
            />
            </div>
        </form>
    </div>
    <div v-if="querry" class="container">
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
                <td>{{ row.price }}</td>
                <td>{{ moment(String(row.time)).format('MM/DD/YYYY@hh:mm') }}</td>
            </tr>
        </table> 
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import { ref } from 'vue'
    import { token } from '../stores/token'
    export default {
        setup() {
            const symbol = ref("USD")
            const api = ref({})
            const loading = ref()
            const querry = ref(false)

            axios.get('https://cloud.iexapis.com/stable/stock/' + symbol.value + '/quote?token=' + token.token)
            .then(function (response) {
                api.value = response.data;
            })

            return {
                api,
                loading,
                querry,
            }
        }
    }
</script>

<style scoped>

button:hover {
  filter: drop-shadow(0 0 0.5em #42b883aa);
}

.row {
  padding: 10px;
}

.flex-end {
  margin-top: 24px;
}

</style>