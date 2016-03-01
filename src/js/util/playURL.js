export default function playURL() {
	let sushiCount = 0;

	setInterval(() => {
		sushiCount++;
		window.history.replaceState('', '', Array(sushiCount).join('🍣'));
	}, 1000);
}
