<template>
    <div class="container">
        <div class="container">
            <label for="multi-select">Your available shares: </label>
            <div class="select">
            <select v-model="selectValue" @change="onChange($event)">
                <option disabled selected>----</option>
                <option v-for="row in historyData" :key="row.id">{{ row.symbol }}</option>
            </select>

            <span class="focus"></span>
            </div>
            <div v-if="selectValue" class="Btn-Confirm form-widget  flex-center">
                <p>How many shares you want to sell ? </p><input :placeholder="remainingShares ? remainingShares : 'Loading...'" v-model="sharesNumber" @keypress="onlyNumber" min="1"/>
                <button class="Btn-Confirm" @click.prevent="sellShares"> Sell</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/router";
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue"

export default {
    setup () {
        const historyData = ref({});
        const selectValue = ref();
        const sharesNumber = ref();
        const selectedSymbol = ref();
        const remainingShares = ref();
        const currentMoney = ref();
        let requestValue: any;

        async function getCurrentShares() {
            try {
                let {error, data} = await supabase.from('profiles').select('money').eq('id', supabase.auth.user()?.id)

                if (data) currentMoney.value = data[0].money;
                if (error) throw error;
            } catch (error:any) {
                alert(error.message);
            }
            try {
                let { data, error,status } = await supabase
                .from('history')
                .select('id, title, symbol, shares')
                .eq('user_id', supabase.auth.user()?.id)


                if (error && status !== 406) throw error;
                if (data) {
                    historyData.value = data;
                }
            } catch (error: any) {
                alert(error.message)
            }
        }

        async function onChange(e:any) {
            let { data } = await supabase
            .from('history')
            .select('shares')
            .match({user_id: supabase.auth.user()?.id, symbol: e.target.value})

            if(data) {
                remainingShares.value = "Max: " + data[0].shares + " Share(s)";
            }
        }

        function onlyNumber ($event:any) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57)) { // 46 is dot
                $event.preventDefault();
            }
        }

        async function sellShares() {
            let number;

            if (sharesNumber.value <= 0) {
                alert("You must but a number higher than 0")
                return;
            }
            try {
                let { data, error, status } = await supabase
                .from('history')
                .select('shares, title, symbol, price')
                .match({user_id: supabase.auth.user()?.id, symbol: selectValue.value})

                if (error && status != 406) throw error;
                if (data) {
                    if (sharesNumber.value > data[0].shares) {
                        alert("You don't have that much shares on " + selectValue.value)
                        return;
                    } else {
                        requestValue = data;
                        number = data[0].shares
                    }
                }
            } catch (error:any) {
                alert(error.message);
            }

            if (sharesNumber.value < number) {
                try {
                    let {error} = await supabase.from('history').update({shares: requestValue[0].shares - sharesNumber.value, time: new Date()})
                    .match({user_id: supabase.auth.user()?.id, symbol: selectValue.value})
                    
                    updateMoney();
                    if (error) throw (error)
                } catch (error:any) {
                    console.log(error.message);
                } finally {
                    router.push('/');
                }   
            } else {
                try {
                    let {error} = await supabase.from('history').delete().match({user_id: supabase.auth.user()?.id, symbol: selectValue.value})
                    alert("Sold " + sharesNumber.value + " of " + selectValue.value);
                    
                    updateMoney();
                    if(error) throw(error)
                } catch (error:any) {
                    console.log(error.message);
                } finally {
                    // Send user to home page
                    router.push('/');
                }

            }
            
        }

        async function updateMoney() {
            try {
                let {error} = await supabase.from('profiles').update({money: currentMoney.value + currentMoney.value}).eq("id", supabase.auth.user()?.id)

                if (error) throw error
            } catch (error:any) {
                alert(error.message);
            }
        }

        onMounted(() => {
            getCurrentShares();
        })
        return {
            currentMoney,
            remainingShares,
            selectedSymbol,
            historyData,
            selectValue,
            sharesNumber,

            updateMoney,
            onChange,
            onlyNumber,
            sellShares,
        }
    }
}
</script>

<style scoped>

    .Btn-Confirm {
        margin-top: 5%;

    }
    .container {
        margin-top: 50px;
        padding-left: 5%;
    }
    select {    

        background-color: transparent;
        border: none;
        padding: 0 1em 0 0;
        margin: 0;
        width: 100%;
        font-size: inherit;
        cursor: inherit;
        line-height: inherit;
        height: 2em;
    }
</style>