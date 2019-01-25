<template>
    <div class="page">
        {{ data }}
    </div>
</template>

<script type="text/javascript">
import mainStore from '../../store/main';

export default {
    name:  'Main',
    computed: {
        loading() {
            return this.$store.state.main.loading;
        },
        data() {
            return this.$store.state.main.data;
        },
    },
    destroyed() {
        this.$store.unregisterModule('main');
    },
    asyncData({ store }) {
        store.registerModule('main', mainStore);

        return store.dispatch('main/fetchData');
    },
};
</script>
