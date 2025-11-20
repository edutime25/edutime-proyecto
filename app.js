// TEMPORIZADOR (POMODORO SIMPLE)
let timer;
function startTimer() {
    let minutes = document.getElementById("minutes").value;
    let time = minutes * 60;

    if (!minutes || minutes <= 0) {
        document.getElementById("countdown").innerText = "Ingresa minutos válidos";
        return;
    }

    clearInterval(timer);

    timer = setInterval(() => {
        let min = Math.floor(time / 60);
        let sec = time % 60;

        document.getElementById("countdown").innerText =
            `${min} min ${sec < 10 ? '0' : ''}${sec} seg`;

        if (time <= 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerText = "¡Tiempo terminado!";
        }

        time--;
    }, 1000);
}

// LISTA DE TAREAS
function addTask() {
    const taskText = document.getElementById("taskInput").value;
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `${taskText} <button onclick="this.parentElement.remove()">X</button>`;
    
    document.getElementById("tasks").appendChild(li);
    document.getElementById("taskInput").value = "";
}
