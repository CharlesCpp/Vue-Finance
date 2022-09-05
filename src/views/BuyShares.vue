<template>
    <div class="container">
        <form class="form-widget row flex flex-center" @submit.prevent="getShares">
            <div>
                <label>Available money = ${{ money }}</label>
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
                <button @click="buyShares" class="row-button block">Buy</button>
            </tr>
        </table> 
    </div>
    <div class="error" v-if="err">
        <p class="p-error"> {{ err.response.data }} </p>
    </div>
</template>

<script lang="ts">
    import router from '@/router'
    import { supabase } from '@/supabase'
    import axios from 'axios'
    import { onMounted, ref } from 'vue'
    import { token } from '../stores/token'
    export default {
        setup() {
            const symbol = ref("")
            const api = ref({})
            const loading = ref(false)
            const querry = ref(false)
            const err = ref()
            const money = ref()
            const price = ref()

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

            async function buyShares() {
                let input = window.prompt("How many shares you would like to buy ?");
                let i = Number(input);
                if (isNaN(i) || i < 1) {
                        alert("Wrong input: (Must be a valid number) or higher than 0")
                        return;
                }

                
                // Buying the symbol's shares and updating the database
                try {
                    const response = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol.value + '/quote?token=' + token.token)
                    price.value = response.data.latestPrice * i;

                    if (money.value < price.value) {
                        alert("You don't own that much money");
                        return;
                    }
                    
                    let { data } = await supabase
                    .from('history')
                    .select('symbol, shares')
                    .match({user_id: supabase.auth.user()?.id, symbol: symbol.value})
                    .single()
                    
                    // Checking if user already bought the same symbol's share before
                    if(!data) {

                        const update = {
                            user_id: supabase.auth.user()?.id,
                            title: response.data.companyName,
                            symbol: symbol.value,
                            shares: i,
                            price: response.data.latestPrice,
                            time: new Date(),
                        }

                        let { error } = await supabase.from('history').insert(update, {
                            returning: "minimal",
                        })

                        if(error) throw error;

                    } else {

                        const update = {
                            shares: data.shares + i,
                            time: new Date(),
                        }

                        let { error } = await supabase
                        .from('history')
                        .update(update, {
                            returning: "minimal",
                        })
                        .match({user_id: supabase.auth.user()?.id, symbol: symbol.value})

                        if (error) throw error
                    }
                    
                } catch (error:any) {
                    alert(error.message);                    
                }
                
                // Updating user's money
                try {
                    loading.value = true

                    if (money.value < price.value) {
                        return;
                    }

                    const updates = {
                    id: supabase.auth.user()?.id,
                    money: money.value - price.value,
                    }

                    let { error } = await supabase.from("profiles").upsert(updates, {
                    returning: "minimal", // Don't return the value after inserting
                    })

                    if (error) throw error
                } catch (error: any) {
                    alert(error.message)
                } finally {
                    loading.value = false
                    router.push('/');
                }
            }

            async function getMoney() {
                try {
                    let { data, error, status } = await supabase
                    .from('profiles')
                    .select(`money`)
                    .eq("id", supabase.auth.user()?.id)
                    .single()
                
                    if (error && status !== 406) throw error

                    if (data) {
                    money.value = data.money
                    }
                } catch (error:any) {
                    alert(error.message)
                }
            }
            
            onMounted(() => {
                getMoney()
            })

            return {
                api,
                loading,
                querry,
                getShares,
                symbol,
                err,
                buyShares,
                money,
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