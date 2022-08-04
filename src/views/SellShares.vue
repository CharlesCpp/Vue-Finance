<template>
    <div class="container">
        <div class="container">
            <label for="multi-select">Your available shares: </label>
            <div class="select">
            <select v-model="selectValue">
                <option disabled selected>----</option>
                <option v-for="row in historyData" :key="row.id">{{ row.symbol }}</option>
            </select>

            <span class="focus"></span>
            </div>
            <div v-if="selectValue" class="Btn-Confirm form-widget  flex-center">
                <p>How many shares you want to sell ? </p><input placeholder="Min: 1" @keypress="onlyNumber"/>
                <button class="Btn-Confirm" @click.prevent="sellShares"> Sell</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue"

export default {
    setup () {
        const historyData = ref({});
        const selectValue = ref();
        const sharesNumber = ref();

        async function getCurrentShares() {
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

        function onlyNumber ($event:any) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode <= 48 || keyCode > 57)) { // 46 is dot
                $event.preventDefault();
            }
        }

        async function sellShares() {
            
        }

        onMounted(() => {
            getCurrentShares();
        })
        return {
            historyData,
            selectValue,
            onlyNumber,
            sellShares,
            sharesNumber,
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