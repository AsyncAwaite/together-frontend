<template>
    <div>

    </div>
</template>

<script>
    export default {
        mounted(){
            this.$store.dispatch('setEvents', {card_added:true});
            window.close();
        }
    }
</script>

<style lang="scss" scoped>

</style>