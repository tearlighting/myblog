<script lang="ts">
import Vue from "vue";
import SVGIcon from '@/components/svgIcon/index.vue'
import { faBackward, faBackwardStep, faForward, faForwardStep } from '@fortawesome/free-solid-svg-icons';

export default Vue.extend({
	props: {
		current: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10
		},
		total: {
			type: Number,
			default: 0
		},
		visibleNumber: {
			type: Number,
			default: 10
		}
	},
	components: {
		SVGIcon
	},
	model: {
		prop: 'current',
		event: 'pageChange'
	},
	methods: {
		handlePageChange(page: number) {
			if (page < 1) {
				page = 1
			}
			if (page > this.pageNumber) {
				page = this.pageNumber
			}
			page !== this.current && this.$emit('pageChange', page)
		}
	},
	computed: {
		//总页数
		pageNumber(): number {
			//向上取整
			return Math.ceil(this.total / this.pageSize)
		},
		//当前分页显示最小值
		minVisibleNumber(): number {
			//向下取整
			let res = this.current - Math.floor(this.visibleNumber / 2)
			if (res < 1) {
				res = 1
			}
			return res
		},
		maxVisbleNumber(): number {
			let res = this.current + Math.floor(this.visibleNumber / 2)
			if (res > this.pageNumber) {
				res = this.pageNumber
			}
			return res
		},
		pages(): number[] {
			const res: number[] = []
			for (let i = this.minVisibleNumber; i <= this.maxVisbleNumber; i++) {
				res.push(i)
			}
			return res
		},
		next: () => faForward,
		end: () => faForwardStep,
		before: () => faBackward,
		start: () => faBackwardStep
	}
})
</script>

<template>
	<div class="pagination-container" v-if="pageNumber >= 1">

		<a :class="{ disabled: current === 1 }" @click="handlePageChange(1)">
			<!-- |&lt;&lt; -->
			<SVGIcon :icon="start"></SVGIcon>
		</a>

		<a :class="{ disabled: current === 1 }" @click="handlePageChange(current - 1)">
			<SVGIcon :icon="before"></SVGIcon>
		</a>

		<a v-for="(n, index) of pages" :key="index" :class="{ active: n === current }" @click="handlePageChange(n)">{{ n
			}}</a>
		<a :class="{ disabled: current === pageNumber }" @click="handlePageChange(current + 1)">
			<!-- &gt;&gt; -->
			<SVGIcon :icon="next"></SVGIcon>

		</a>
		<a :class="{ disabled: current === pageNumber }" @click="handlePageChange(pageNumber)">
			<SVGIcon :icon="end"></SVGIcon>

		</a>
	</div>
</template>

<style lang="less" scoped>
.pagination-container {
	// display: flex;

	// display: grid;
	// grid-template-rows: 1fr;
	// grid-template-columns: 1fr;
	// justify-items: center;
	// grid-auto-rows: 1em;
	display: flex;
	justify-content: center;
	margin-top: 1rem;

	a {
		margin: 0 .2rem;
		cursor: pointer;

		&.disabled {
			cursor: not-allowed;

			:deep(.svg-icon-container) {
				// background: red;

				svg {
					cursor: not-allowed;
				}



			}
		}

		&.active {
			font-weight: bold;
			cursor: text;
		}

		// &:hover {
		// 	color: lightblue;
		// }
	}

}
</style>
