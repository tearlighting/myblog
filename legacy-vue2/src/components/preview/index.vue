

<template>
   <div class="preview-container">
	    <label class="title">
			<slot name="title">
				<!-- title -->
			</slot>
		</label>
		<div class="content">
			<slot name='content'></slot>
			<!-- content preview -->
		</div>
		<div class="desc">
         <pre>
		   <code class="language-javascript">
			<slot name="desc">
<!-- {{desc}} -->
			</slot>
           </code>
        </pre>
</div>
       
  </div>
</template>

<style lang="less" scoped>

</style>
