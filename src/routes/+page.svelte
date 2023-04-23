<script lang="ts">
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';
    import { ioClient } from "$lib/webSocketConnection"
    import { onMount } from "svelte"
	import boardConfig from "./boardConfig";

    let boardMessage = ""
    let textMatrix = boardConfig.EMPTY_MATRIX()
    let inputElements: NodeListOf<HTMLInputElement>
    let username = ""
    $: debugMessage = "";

    onMount(() => {
        ioClient.on('message', message => {
            boardMessage = message.message
        })

        // ioClient.on('name', name => {
        //     console.log({name})
        // })

        inputElements = document.querySelectorAll('input')
    })

    const submitBoardMessage = () => {
        debugMessage = ""

        if (!username) {
            alert("Please enter a username before submitting!")
            return
        }
        
        try {
            ioClient.emit('message', {
                message: textMatrix.flat().join(""),
                username
            })
        } catch (error: any) {
            debugMessage = error.toString()
        } finally {
            if (debugMessage === "") {
                debugMessage = `Message submitted by ${username}!`
            }
        }
    }

    const getValidatedCoordinates = (rowIndex: number, colIndex: number, isBackspace: boolean) => {
        if (colIndex <= 1 && isBackspace) {
            return {
                i: rowIndex - 1,
                j: boardConfig.COLS + 1
            }
        }
        else if (colIndex >= boardConfig.COLS && !isBackspace) {
            return {
                i: rowIndex + 1,
                j: 0
            }
        } 
        else {
            return {
                i: rowIndex,
                j: colIndex
            }
        }
    }

    const jumpToNext = (event: any, rowIndex: number, colIndex: number) => {
        const value = event.target.value;
        const {i, j} = getValidatedCoordinates(rowIndex, colIndex, false)

        if (value !== '' && event.code !== "Backspace") {
            const nextInput = document.getElementById(`input-${i}-${j}`)
            nextInput?.focus()
        }
    }

    const checkBackspace = (event: any, rowIndex: number, colIndex: number) => {
        const {i, j} = getValidatedCoordinates(rowIndex, colIndex, true)

        if (event.code === "Backspace") {
            const nextInput = document.getElementById(`input-${i}-${j - 2}`)
            nextInput?.focus()
        }
    }
</script>

<svelte:head>
	<title>Split-Flap HQ</title>
	<meta name="description" content="An interactive split-flap display board for decorating your home" />
</svelte:head>

<section>
	<div class="message-input">
        <pre>{debugMessage}</pre>
        {#each textMatrix as rows, i}
            <div class="matrix-row">
                {#each rows as cols, j}
                    <input
                        id={`input-${i}-${j}`}
                        class="matrix-cell"
                        type="text"
                        maxlength="1"
                        bind:value={textMatrix[i][j]}
                        on:keydown={(e) => jumpToNext(e, i, j + 1)}
                        on:keyup={(e) => checkBackspace(e, i, j + 1)}
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        spellcheck="false"
                    >
                {/each}
            </div>
        {/each}
        <input bind:value={username}>
        <button on:click={submitBoardMessage}>→</button>
    </div>
</section>

<style>
    pre {
        color: white;
    }
    
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
        background: black;
        width: 100vw;
        height: 100vh;
        padding: 60px;
	}

    .message-input {
        /* background: red; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .matrix-row {
        display: flex;
        margin: 5px 0 5px 0;
    }
    
    .matrix-cell {
        width: 10px;
        height: 20px;
        background: none;
        border: none;
        border-bottom: 1px solid white;
        margin: 0 1px 0 1px;
        color: white;
        font-size: 15px;
    }

    .message-input button {
        margin: 20px;
        padding: 0 10px 5px 10px;
        line-height: 30px;
        font-size: 30px;
        font-weight: bold;
    }
</style>
