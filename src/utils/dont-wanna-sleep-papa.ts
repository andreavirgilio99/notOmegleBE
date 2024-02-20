import axios from "axios"

/**
 * some hosting services put my babies to sleep when there's inactivity, I don't like that, so here's some fake activity for y'all
 */
export function IDontWannaSleepPapa() {
    setInterval(() => {
        axios.get('https://hangman-game-6m0a.onrender.com/')
    }, 1000 * 180)
}