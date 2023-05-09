export function textToSpeech(txt: string, speed = 1, volume = 1) {
	return new Promise((resolve) => {
		const speech = new window.SpeechSynthesisUtterance();
		speech.lang = 'en-US';
		speech.pitch = 1;
		speech.text = txt;
		speech.rate = speed;
		speech.volume = volume;
		speech.addEventListener('end', resolve);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(speech);
	});
}