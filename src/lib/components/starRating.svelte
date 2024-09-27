<script lang="ts">
	export let rating: number;
</script>

<input class="rating rating--nojs" max="5" step=".25" type="range" bind:value={rating}>

<style>
	.rating {
		--dir: right;
		--fill: gold;
		--fillbg: rgba(100, 100, 100, 0.15);
		--stars: 5;
		--starsize: 3rem;
		--symbol: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M48.856,22.73c0.983-0.958,1.33-2.364,0.906-3.671c-0.425-1.307-1.532-2.24-2.892-2.438l-12.092-1.757c-0.515-0.075-0.96-0.398-1.19-0.865L28.182,3.043c-0.607-1.231-1.839-1.996-3.212-1.996c-1.372,0-2.604,0.765-3.211,1.996L16.352,14c-0.23,0.467-0.676,0.79-1.191,0.865L3.069,16.622c-1.359,0.197-2.467,1.131-2.892,2.438c-0.424,1.307-0.077,2.713,0.906,3.671l8.749,8.528c0.373,0.364,0.544,0.888,0.456,1.4L8.224,44.701c-0.183,1.06,0.095,2.091,0.781,2.904c1.066,1.267,2.927,1.653,4.415,0.871l10.814-5.686c0.452-0.237,1.021-0.235,1.472,0l10.815,5.686c0.526,0.277,1.087,0.417,1.666,0.417c1.057,0,2.059-0.47,2.748-1.288c0.687-0.813,0.964-1.846,0.781-2.904l-2.065-12.042c-0.088-0.513,0.083-1.036,0.456-1.4L48.856,22.73z"/></svg>');
		--value: 1;
		--w: calc(var(--stars) * var(--starsize));
		--x: calc(100% * (var(--value) / var(--stars)));
		block-size: var(--starsize);
		inline-size: var(--w);
		position: relative;
		touch-action: manipulation;
		-webkit-appearance: none;
	}
	
	.rating::-moz-range-track {
		background: var(--fillbg);
		block-size: 100%;
		mask: repeat left center/var(--starsize) var(--symbol);
	}
	
	.rating::-webkit-slider-runnable-track {
		background: var(--fillbg);
		block-size: 100%;
		mask: repeat left center/var(--starsize) var(--symbol);
		-webkit-mask: repeat left center/var(--starsize) var(--symbol);
	}
	
	.rating::-moz-range-thumb {
		height: var(--starsize);
		opacity: 0;
		width: var(--starsize);
	}
	
	.rating::-webkit-slider-thumb {
		background-color: var(--fill);
		box-shadow: calc(0rem - var(--w)) 0 0 var(--w) var(--fill);
		height: var(--starsize);
		opacity: 1;
		width: 1px;
		-webkit-appearance: none;
	}
	
	.rating::-moz-range-progress {
		background: var(--fill);
		block-size: 100%;
		mask: repeat left center/var(--starsize) var(--star);
	}
</style>