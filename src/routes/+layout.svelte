<script>
	import './styles.css';
</script>

<div class="app">
	<!-- <main> -->
        <!-- WHAT IS A SLOT -->
		<slot /> 
	<!-- </main> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
        font-family:'Courier New', Courier, monospace
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
	}
</style>
