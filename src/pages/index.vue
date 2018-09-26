<template lang="pug">
section.container
	searchBg
	searchArea(:fixed="true")
		router-link(to="/bd/login" tag="h1") FrankChou's Blog
</template>

<script>
import searchBg from '@/components/searchBg'
import searchArea from '@/components/searchArea'
	export default {
		components:{ searchBg,searchArea },
		data() {
			return {
				
			}
		},
		created() {
			if(this.$store.state.activeAni ==2 ){
				setTimeout(() => {
					this.$store.state.activeAni = 3;
					this.$store.state.activeAni = 0;
				}, 100);
			}
		},
        methods:{
			
        }
	}
</script>

<style lang="scss" scoped>
	
	h1 {
		margin-bottom: 20px;
		font-size: 30px;
		text-align: center;
		color: #FFFFF9;
	}
</style>