<script lang="ts">
    import { ioClient } from "$lib/webSocketConnection"
    import { onMount } from "svelte"
    import boardConfig from "../boardConfig";

    $: boardMessage = "no message!"
    $: lastChangedBy = "nobody"
    $: lastChangedDate = "never"

    let boardMatrix: string[][]
    $: boardMatrix = []
    let staleBoardMatrix: string[][]
    $: staleBoardMatrix = []
    let debugChar = ""
    $: flipped = false

    const buildBoard = () => boardMatrix = boardConfig.EMPTY_MATRIX()

    const updateBoard = (msg: string) => {
        const msgArr = msg.split("")

        boardMatrix.forEach(async (row, i) => {
            await new Promise(resolve => setTimeout(resolve, i * boardConfig.UPDATE_SPEED * boardConfig.COLS))
            row.forEach(async (cell, j) => {
                await new Promise(resolve => setTimeout(resolve, j * boardConfig.UPDATE_SPEED));

                const char = msgArr[(i * row.length) + j]
                boardMatrix[i][j] = char === undefined ? "" : char
            })
        })
    }

    const buildStaleBoard = () => staleBoardMatrix = JSON.parse(JSON.stringify(boardMatrix))

    onMount(() => {
        ioClient.on('message', ({ from, message, time }) => {
            console.log('MESSAGE RECEIVED:', { from, message, time })
            boardMessage = message
            lastChangedBy = from
            lastChangedDate = time

            updateBoard(boardMessage)
        })

        buildBoard()
        buildStaleBoard()
    })

    const handleFlip = async () => {
        flipped = !flipped
        debugChar = flipped ? "Z" : "A"

        updateBoard(boardMessage)
        // buildStaleBoard()
    }
</script>

<section class="board">
    {#each boardMatrix as rows, i}
        <div class="board-row">
            {#each rows as cols, j}
                <div class="board-flap">
                    <div class="board-flap-cell">
                        <div class="{`front top-half ${boardMatrix[i][j] !== staleBoardMatrix[i][j] ? 'flipped' : ''}`}">{staleBoardMatrix[i][j]}</div>
                        <div class="{`front bottom-half ${boardMatrix[i][j] !== staleBoardMatrix[i][j] ? 'flipped' : ''}`}">{staleBoardMatrix[i][j]}</div>
                        <div class="{`back top-half ${boardMatrix[i][j] !== staleBoardMatrix[i][j] ? 'flipped' : ''}`}">{boardMatrix[i][j]}</div>
                        <div class="{`back bottom-half ${boardMatrix[i][j] !== staleBoardMatrix[i][j] ? 'flipped' : ''}`}">{boardMatrix[i][j]}</div>
                    </div>
                </div>
            {/each}
        </div>
    {/each}
    <div class="dashboard">
        <div class="dashboard-updated">
            <div class="updated-header">
                <p>Last updated on:</p>
                <h3>{lastChangedDate}</h3>
                <p>by</p>
            </div>
            <div class="updated-by">
                <h1>{lastChangedBy}</h1>
            </div>
        </div>
    </div>
</section>

<style>
    .dashboard {
        padding: 0 10px 0 10px;
        display: flex;
        height: 50%;
        font-family: Helvetica;
        background: black;
        outline: 8px solid black;
    }

    .dashboard-updated {
        /* background: gray; */
        display: flex;
        flex-direction: column;
        width: 30%;
    }

    .updated-header {
        color: white;
        display: flex;
        align-items: center;
        /* justify-content: center; */
        line-height: 1px;
        /* background: green; */
    }

    .updated-by {
        /* background: pink; */
        line-height: 1px;
        color: white;
    }

    .updated-header * {
        margin: 0 5px 0 5px;
    }

    .board {
        background: black;
        display: flex;
        flex-direction: column;
        border: 8px solid black;
        height: 99vh;
    }

    .board-row {
        display: flex;
        width: 100%;
        justify-content: center;
    }

    .board-flap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .board-flap-cell {
        background: #14161a;
        color: white;
        font-size: 80px;

        /* padding: 8px; */
        outline: 1px solid gray;
        margin: 8px;

        position: relative;
        overflow: hidden;
        /* text-align: center; */
        
        width: 80px;
        height: 80px;

        transform-style: preserve-3d;
    }

    .top-half, .bottom-half {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        backface-visibility: hidden;
        overflow: hidden;
    }

    .top-half {
        top: 0;
        line-height: 80px;
        transform: translateZ(40px);
        transform-origin: bottom;
    }

    .bottom-half {
        bottom: 0;
        line-height: 0px;
        transform: translateZ(-40px);
        transform-origin: top;
        background: black !important;
    }

    .board-flap-cell .front, .board-flap-cell .back {
        position: absolute;
        backface-visibility: hidden;
        width: 100%;
        height: 50%;
        background: #14161a;
        outline: 1px solid gray;
    }

    .board-flap-cell .front {
        z-index: 2;
        transform: rotateX(0deg);
        transition: transform 1s;
    }

    .board-flap-cell .back {
        z-index: 1;
        transition: transform 1s;
    }

    .board-flap-cell .back.bottom-half {
        transform: rotateX(-180deg);
    }

    .board-flap-cell .front.top-half.flipped {
        animation-duration: 1s;
        animation-name: frontTopHalfFlipDown;
        animation-fill-mode: forwards;
    }

    @keyframes frontTopHalfFlipDown {
        from {
            z-index: 2;
            transform: rotateX(0deg);
        }

        to {
            z-index: 1;
            transform: rotateX(180deg);
        }
    }

    .board-flap-cell .back.bottom-half.flipped {
        animation-duration: 1s;
        animation-name: backBottomHalfFlipDown;
        animation-fill-mode: forwards;
    }

    @keyframes backBottomHalfFlipDown {
        from {
            z-index: 1;
            transform: rotateX(-180deg);
        }

        to {
            z-index: 2;
            transform: rotateX(0);
        }
    }
</style>

<!-- 1920 x 1080 -->