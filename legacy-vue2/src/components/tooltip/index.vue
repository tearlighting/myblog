<script lang="ts">
import Vue,{Events} from "vue"
import {EDirection, ETrigger, props} from './prop'
export default Vue.extend({
	data(){
		return {
			triggerElm:null as HTMLElement|null,
			showTooltip: false,
			vshowControl: false,
			clickOutArea(){
               if(this.showTooltip){
				  this.showTooltip = false
			   }
			   
			}
		
		}
	},
   props,
   mounted(){
	 this.$nextTick(()=>{
		  this.triggerElm = this.$refs['triggerElm'] as any		  
	 })
	 window.addEventListener('click',this.clickOutArea.bind(this))
	
   },
   beforeDestroy(){
     window.removeEventListener('click',this.clickOutArea)
   },
   computed:{
	  popPostion(){
		 if(!this.triggerElm){
			return ''
		 }
		 const height = this.triggerElm.clientHeight
		 const width = this.triggerElm.clientWidth
		 let res: Partial<CSSStyleDeclaration> = {
			
		  }
		 switch(this.direction){
			case EDirection.left:
              res = {
                 right:-width + 'px',
			  }
			  break
			case EDirection.right:
				res = {
                   left: width + 'px'
				}
				break
			case EDirection.top:
				res = {
					top:-height+'px'
				}
				break
			case EDirection.bottom:
				res = {
					top:height+'px'
				}
		 }
		 res.opacity = this.showTooltip?'1':'0'
		 res.visibility = this.showTooltip?"visible":'hidden'
		 return res
	  },
	  events(){
		 const res: Record<string,(...arg: any)=>any> = {}
		 if(this.trigger === ETrigger.hover){
			 res.mouseenter = ()=>this.showTooltip=true
		 }else if(this.trigger===ETrigger.click){
             res.click = (e:any)=>{
			    e.stopPropagation()
				this.showTooltip = !this.showTooltip
			 }
		 }
		 return res
	  },
	  outEvent(){
		 const res:Record<string,(...arg: any)=>any> = {}
		 if(this.trigger === ETrigger.hover){
			res.mouseleave = ()=>this.showTooltip = false
		 }
		 return res
	  }
   },
   watch:{
	  showTooltip(){
		if(this.showTooltip){
			this.vshowControl = this.showTooltip
		}else{
			setTimeout(() => {
				this.vshowControl = this.showTooltip
			}, 1000);
		}
	  }
   }

})
</script>

<template>

    <div class="tooltip-container" v-on="outEvent">
        <div class="tooltip-trigger" ref="triggerElm" v-on='events' >
		  <slot></slot>
		</div>
		<div class="tooltip-pop" :style="popPostion" v-show="vshowControl">
			<slot name='tooltip'>
				<div class="popContainer">
					this is a tooltip!
				</div>
			</slot>
		</div>
    </div>

</template>

<style lang="less" scoped>
.tooltip-container{
	
	position: relative;
	.tooltip-trigger{
		
	}
	.tooltip-pop{
		position: absolute;
		left: 0;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: center;
		width: 100%;
		border-radius: 1em;
		transition: all .3s ease 0s;
		// overflow: hidden;
		&::after{
			content: "";
			height: 10px;
			width: 10px;
			position: absolute;
			transform: translateY(-50%) rotate(45deg);
			z-index: -10;
			// transform: translateY(-50%);
		
			
		}
		
	}
}
</style>