<template>
    <div class="container">
        Buy Shares
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import { ref } from 'vue'
    import { token } from '../stores/token'
    export default {
        setup() {
            const querry = ref(false)
            const symbol = ref("USD")

            axios.get('https://cloud.iexapis.com/stable/stock/' + symbol.value + '/quote?token=' + token.token)
            .then(function (response) {
                console.log(response.data.companyName)
            })
        }
    }
</script>

<style scoped>

</style>