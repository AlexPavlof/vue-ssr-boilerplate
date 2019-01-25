<template>
    <div class="page-404">
        Page not found.
        <button @click="gotoMainPage">
            Вернуться на главную
        </button>
    </div>
</template>

<script type="text/javascript">
export default {
    name:    'NotFound',
    methods: {
        gotoMainPage() {
            this.$router.push('/');
        },
    },
};
</script>
