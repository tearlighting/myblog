<script lang="ts">
import Vue from "vue"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faBars} from '@fortawesome/free-solid-svg-icons'

export default Vue.extend({
  props:{
	 icon:{
		default:faBars,
		required:true
	 }
  },
  components:{
	FontAwesomeIcon
  }
})
</script>

<template>

	<div class="svg-icon-container">
	  <FontAwesomeIcon :icon="icon" class="icon" @click="$emit('click',icon,$event)"/>
	</div>

</template>

<style lang="less" scoped>
.svg-icon-container{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	.icon{
		 width: 1em;
         height: 1em;
		 transition:all 100ms ease;
		 &:hover{
			transform: scaleY(1.1);
			cursor: pointer;

		 }
	}
}
</style>