<template>
    <div class="container">
        <form class="form-widget row flex flex-center" @submit.prevent="getShares">
            <div>
                <label>Symbol</label>
                <input id="symbol" type="text" placeholder="Symbol (ex: USD)" v-model="symbol"/>
            </div>

            <div class="flex-end">
            <input
                type="submit"
                class="button block primary"
                :value="loading ? 'Loading ...' : 'Search'"
                :disabled="loading"
            />
            </div>
        </form>
    </div>
    <div v-if="querry" class="table-row">
         <table>
            <tr v-if="loading">
                <th> Loading... </th>
                <th>Loading...</th>
                <th>Loading...</th> 
                <th>Loading...</th>
                <th>Loading...</th>
                <th>Loading...</th>
            </tr>
            <tr v-else>
                <th> Company Name </th>
                <th>Time</th>
                <th>Last Price</th> 
                <th>Source</th>
                <th>Symbol</th>
                <th>Actions</th>
            </tr>
            <tr for="api" >
                <td>{{ api.companyName }}</td>
                <td>{{ new Date().toDateString() }}</td>
                <td>${{ api.latestPrice }}</td>
                <td>{{ api.closeSource }}</td>
                <td>{{ api.symbol }}</td>
                <button @submit.prevent="buyShares" class="row-button block">Buy</button>
            </tr>
        </table> 
    </div>
    <div class="error" v-if="err">
        <p class="p-error"> {{ err.response.data }} </p>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import { ref } from 'vue'
    import { token } from '../stores/token'
    export default {
        setup() {
            const symbol = ref("")
            const api = ref({})
            const loading = ref(false)
            const querry = ref(false)
            const err = ref()

            async function getShares() {
                err.value = false;
                loading.value = true;
                if (!symbol.value) {
                    alert("You must put a valid symbol")
                    loading.value = false;
                    return;
                }
                try {
                    const response = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol.value + '/quote?token=' + token.token)
                    querry.value = true;
                    loading.value = false;
                    api.value = response.data
                } catch (error) {
                    err.value = error;
                    querry.value = false;
                    loading.value = false;
                }
            }

            const buyShares = () => {
                alert("You bought this share")
            }

            return {
                api,
                loading,
                querry,
                getShares,
                symbol,
                err,
                buyShares,
            }
        }
    }
</script>

<style scoped>

button {
    border: 0;
}

button:hover {
  filter: drop-shadow(0 0 0.5em #42b883aa);
}

.row {
  padding: 10px;
}

table {
    border-collapse: collapse;
}

.error {
    width: 90%;
    margin-left: 45%;
    margin-right: auto;

}

.p-error {
    color: red;
}

.table-row {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}

.row-button {
    width: 100%;
    margin-top: 2px;
    text-align: left;
}

.flex-end {
  margin-top: 24px;
}

</style>