<template>
    <a-config-provider>
        <div id="app">
            <router-view/>
        </div>
    </a-config-provider>
</template>

<script>
import Echo from 'laravel-echo'

export default {
    data() {
        return {}
    },
    computed: {},
    created() {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: 'localhost:6001',
            client: require('socket.io-client')
        })
        // 订阅频道
        echo.channel('test')
            .listen('ShippingStatusUpdated', (e) => {
                console.log('event')
                console.log(e)
            })
        console.log('app')
    }
}
</script>
