<template>
    <div>

    </div>
</template>

<script>
    export default {
        mounted(){
            this.$store.dispatch('setEvents', { payment_online:true});
            window.close();
        }
    }
</script>

<style lang="scss" scoped>

</style>