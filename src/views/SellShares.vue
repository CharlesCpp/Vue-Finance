<template>
    <div class="container">
        <div class="row flex flex-center" v-for="row in historyData" :key="row.id">
        <p>{{ row.title }}</p>
        <p>{{ row.symbol }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue"

export default {
    setup () {
        const historyData = ref();

        async function getCurrentShares() {
            try {
                let { data, error,status } = await supabase
                .from('history')
                .select('id, title, symbol')
                .eq('user_id', supabase.auth.user()?.id)


                if (error && status !== 406) throw error;
                if (data) {
                    historyData.value = data;
                }
            } catch (error: any) {
                alert(error.message)
            }
        }
        onMounted(() => {
            getCurrentShares();
        })
        return {
            historyData,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>