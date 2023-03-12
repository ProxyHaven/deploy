// Detect filters by checking if the request is blocked
const icons = [
	atob("aHR0cHM6Ly93d3cucmVkZGl0LmNvbS9mYXZpY29uLmljbw=="),
	atob(
		"aHR0cHM6Ly93d3cuY29vbG1hdGhnYW1lcy5jb20vdGhlbWVzL2N1c3RvbS9jb29sbWF0aC9mYXZpY29uLmljbw=="
	),
];

for (const icon of icons) {
	const img = document.createElement("img");

	img.src = icon;
	img.onerror = () => location.assign("?unlock");
	img.style.display = "none";

	document.body.appendChild(img);
}
