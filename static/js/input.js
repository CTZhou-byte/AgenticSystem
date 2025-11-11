class ScrcpyInput {
    constructor(callback, videoElement, width, height, debug = false) {
        this.callback = callback
        this.width = width
        this.height = height
        this.debug = debug
        let mouseX = null;
        let mouseY = null;
        let leftButtonIsPressed = false;
        let rightButtonIsPressed = false;

        document.addEventListener('mousedown', (event) => {
            const rect = videoElement.getBoundingClientRect();
            const local_x = event.clientX - rect.left;
            const local_y = event.clientY - rect.top;

            if (videoElement.contains(event.target)) {
                if (event.button === 0) {
                    leftButtonIsPressed = true;

                    mouseX = (local_x / (rect.right - rect.left)) * this.width;
                    mouseY = (local_y / (rect.bottom - rect.top)) * this.height;

                    let data = this.createTouchProtocolData(0, mouseX, mouseY, this.width, this.height, 0, 0, 65535);
                    this.callback(data);
                } else if (event.button === 2) {
                    rightButtonIsPressed = true;

                    this.snedKeyCode(event, 0, 4);
                    event.preventDefault();
                }
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (!leftButtonIsPressed) return;

            const rect = videoElement.getBoundingClientRect();
            const local_x = event.clientX - rect.left;
            const local_y = event.clientY - rect.top;

            if (event.button === 0) {
                leftButtonIsPressed = false;

                if (videoElement.contains(event.target)) {
                    mouseX = (local_x / (rect.right - rect.left)) * this.width;
                    mouseY = (local_y / (rect.bottom - rect.top)) * this.height;
                }
    
                let data = this.createTouchProtocolData(1, mouseX, mouseY, this.width, this.height, 0, 0, 0);
                this.callback(data);

            } else if (event.button === 2 && rightButtonIsPressed) {
                rightButtonIsPressed = false;

                this.snedKeyCode(event, 1, 4);
                event.preventDefault();
            }
        });

        document.addEventListener('mousemove', (event) => {
            if (!leftButtonIsPressed) return;

            const rect = videoElement.getBoundingClientRect();
            const local_x = event.clientX - rect.left;
            const local_y = event.clientY - rect.top;

            if (videoElement.contains(event.target)) {
                mouseX = (local_x / (rect.right - rect.left)) * this.width;
                mouseY = (local_y / (rect.bottom - rect.top)) * this.height;

                let data = this.createTouchProtocolData(2, mouseX, mouseY, this.width, this.height, 0, 0, 65535);
                this.callback(data);
            }
        });

        videoElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        videoElement.addEventListener('wheel', (event) => {
            const hScroll = event.deltaX;
            const vScroll = event.deltaY;
            const deltaMode = event.deltaMode;
            const deltaZ = event.deltaZ;
            const clientX = event.clientX;
            const clientY = event.clientY;
            const button = event.button;

            const rect = videoElement.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            const relativeY = clientY - rect.top;
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;

            // switch (deltaMode) {
            //     case WheelEvent.DOM_DELTA_PIXEL:
            //         deltaModeValue.textContent = 'pixel';
            //         break;
            //     case WheelEvent.DOM_DELTA_LINE:
            //         deltaModeValue.textContent = 'row';
            //         break;
            //     case WheelEvent.DOM_DELTA_PAGE:
            //         deltaModeValue.textContent = 'page';
            //         break;
            //     default:
            //         deltaModeValue.textContent = 'unknown';
            // }
            let data = this.createScrollProtocolData(relativeX, relativeY, width, height, hScroll, vScroll, button);
            this.callback(data);
        });

        videoElement.addEventListener('keydown', async (event) => {
            const androidKeyCode = this.mapToAndroidKeyCode(event);
            if (androidKeyCode !== null) {
                this.snedKeyCode(event, 0, androidKeyCode)
            } else {
                console.log(`key: ${event.code}, not mapped to android key code`);
            }

            if (event.ctrlKey && event.key === 'v') {
                try {
                    const clipboardData = await navigator.clipboard.readText();
                } catch (err) {
                    console.error('Failed to read clipboard contents: ', err);
                }
            }
        });

        videoElement.addEventListener('keyup', async (event) => {
            const androidKeyCode = this.mapToAndroidKeyCode(event);
            if (androidKeyCode !== null) {
                this.snedKeyCode(event, 1, androidKeyCode)
            } else {
                console.log(`key: ${event.code}, not mapped to android key code`);
            }
        });
    }

    resizeScreen(width, height) {
        this.width = width;
        this.height = height;
    }

    mapToAndroidKeyCode(event) {
        const codeToAndroidKeyCode = {
            'KeyA': 29,  // KEYCODE_A
            'KeyB': 30,  // KEYCODE_B
            'KeyC': 31,  // KEYCODE_C
            'KeyD': 32,  // KEYCODE_D
            'KeyE': 33,  // KEYCODE_E
            'KeyF': 34,  // KEYCODE_F
            'KeyG': 35,  // KEYCODE_G
            'KeyH': 36,  // KEYCODE_H
            'KeyI': 37,  // KEYCODE_I
            'KeyJ': 38,  // KEYCODE_J
            'KeyK': 39,  // KEYCODE_K
            'KeyL': 40,  // KEYCODE_L
            'KeyM': 41,  // KEYCODE_M
            'KeyN': 42,  // KEYCODE_N
            'KeyO': 43,  // KEYCODE_O
            'KeyP': 44,  // KEYCODE_P
            'KeyQ': 45,  // KEYCODE_Q
            'KeyR': 46,  // KEYCODE_R
            'KeyS': 47,  // KEYCODE_S
            'KeyT': 48,  // KEYCODE_T
            'KeyU': 49,  // KEYCODE_U
            'KeyV': 50,  // KEYCODE_V
            'KeyW': 51,  // KEYCODE_W
            'KeyX': 52,  // KEYCODE_X
            'KeyY': 53,  // KEYCODE_Y
            'KeyZ': 54,  // KEYCODE_Z

            'Digit0': 7,   // KEYCODE_0
            'Digit1': 8,   // KEYCODE_1
            'Digit2': 9,   // KEYCODE_2
            'Digit3': 10,  // KEYCODE_3
            'Digit4': 11,  // KEYCODE_4
            'Digit5': 12,  // KEYCODE_5
            'Digit6': 13,  // KEYCODE_6
            'Digit7': 14,  // KEYCODE_7
            'Digit8': 15,  // KEYCODE_8
            'Digit9': 16,  // KEYCODE_9

            'Enter': 66,       // KEYCODE_ENTER
            'Backspace': 67,   // KEYCODE_DEL
            'Tab': 61,         // KEYCODE_TAB
            'Space': 62,       // KEYCODE_SPACE
            'Escape': 111,     // KEYCODE_ESCAPE
            'CapsLock': 115,   // KEYCODE_CAPS_LOCK
            'NumLock': 143,    // KEYCODE_NUM_LOCK
            'ScrollLock': 116, // KEYCODE_SCROLL_LOCK

            'ArrowUp': 19,     // KEYCODE_DPAD_UP
            'ArrowDown': 20,   // KEYCODE_DPAD_DOWN
            'ArrowLeft': 21,   // KEYCODE_DPAD_LEFT
            'ArrowRight': 22,  // KEYCODE_DPAD_RIGHT

            'ShiftLeft': 59,   // KEYCODE_SHIFT_LEFT
            'ShiftRight': 60,  // KEYCODE_SHIFT_RIGHT
            'ControlLeft': 113,// KEYCODE_CTRL_LEFT
            'ControlRight': 114,// KEYCODE_CTRL_RIGHT
            'AltLeft': 57,     // KEYCODE_ALT_LEFT
            'AltRight': 58,    // KEYCODE_ALT_RIGHT
            'MetaLeft': 117,   // KEYCODE_META_LEFT
            'MetaRight': 118,  // KEYCODE_META_RIGHT

            'Numpad0': 144,    // KEYCODE_NUMPAD_0
            'Numpad1': 145,    // KEYCODE_NUMPAD_1
            'Numpad2': 146,    // KEYCODE_NUMPAD_2
            'Numpad3': 147,    // KEYCODE_NUMPAD_3
            'Numpad4': 148,    // KEYCODE_NUMPAD_4
            'Numpad5': 149,    // KEYCODE_NUMPAD_5
            'Numpad6': 150,    // KEYCODE_NUMPAD_6
            'Numpad7': 151,    // KEYCODE_NUMPAD_7
            'Numpad8': 152,    // KEYCODE_NUMPAD_8
            'Numpad9': 153,    // KEYCODE_NUMPAD_9
            'NumpadEnter': 160,// KEYCODE_NUMPAD_ENTER
            'NumpadAdd': 157,  // KEYCODE_NUMPAD_ADD
            'NumpadSubtract': 156, // KEYCODE_NUMPAD_SUBTRACT
            'NumpadMultiply': 155, // KEYCODE_NUMPAD_MULTIPLY
            'NumpadDivide': 154,   // KEYCODE_NUMPAD_DIVIDE

            'F1': 131,  // KEYCODE_F1
            'F2': 132,  // KEYCODE_F2
            'F3': 133,  // KEYCODE_F3
            'F4': 134,  // KEYCODE_F4
            'F5': 135,  // KEYCODE_F5
            'F6': 136,  // KEYCODE_F6
            'F7': 137,  // KEYCODE_F7
            'F8': 138,  // KEYCODE_F8
            'F9': 139,  // KEYCODE_F9
            'F10': 140, // KEYCODE_F10
            'F11': 141, // KEYCODE_F11
            'F12': 142, // KEYCODE_F12

            'Back': 4,    // KEYCODE_BACK
            'Home': 3,    // KEYCODE_HOME
            'Menu': 82,   // KEYCODE_MENU
        };

        const androidKeyCode = codeToAndroidKeyCode[event.code];
        return androidKeyCode !== undefined ? androidKeyCode : null;
    }

    snedKeyCode(keyevent, action, keycode) {
        const capsLockState = keyevent.getModifierState('CapsLock');
        const numLockState = keyevent.getModifierState('NumLock');
        const scrollLockState = keyevent.getModifierState('ScrollLock');

        const metaState = (capsLockState ? 0x10000000 : 0) |
            (numLockState ? 0x20000000 : 0) |
            (scrollLockState ? 0x40000000 : 0) |
            (keyevent.ctrlKey ? 0x00001000 : 0) |
            (keyevent.altKey ? 0x00000002 : 0) |
            (keyevent.shiftKey ? 0x00000001 : 0);

        let data = this.createKeyProtocolData(action, keycode, 0, metaState);
        this.callback(data);
    }

    // Protocol: https://github.com/Genymobile/scrcpy/blob/master/server/src/main/java/com/genymobile/scrcpy/ControlMessageReader.java

    createTouchProtocolData(action, x, y, width, height, actionButton, buttons, pressure) {
        const Action = {
            DOWN: 0,
            UP: 1,
            MOVE: 2,
            CANCEL: 3,
            POINTER_DOWN: 5,
            POINTER_UP: 6,
        };

        const MotionEventButton = {
            PRIMARY: 1,
            SECONDARY: 2,
            TERTIARY: 4,
            BACK: 8,
            FORWARD: 16,
        };

        const MotionEventAction = {
            MASK: 0xF,
            POINTER_INDEX_MASK: 0xFF00,
            POINTER_INDEX_SHIFT: 8,
        };

        const messageType = 2;
        let offset = 0;

        // scrcpy 3.1 touch layout:
        // 1(type) + 1(action) + 8(pointerId) + 8(position) + 4(pressure float) + 4(buttons) + 4(actionButton) = 30 bytes
        let payload = new Uint8Array(30);
        payload[offset++] = messageType;
        payload[offset++] = action;

        // write pointerId (-1L) as 8 bytes big-endian: 0xFF x8
        for (let i = 0; i < 8; i++) payload[offset++] = 0xFF;

        // helpers for position packing and int32 BE write
        const toInt = (v) => Number.isFinite(v) ? Math.round(v) : 0;
        const clamp16 = (v) => Math.max(0, Math.min(0xFFFF, toInt(v)));
        const packPos = (pos, size) => ((clamp16(pos) & 0xFFFF) << 16) | (clamp16(size) & 0xFFFF);
        const writeInt32BE = (val) => {
            payload[offset++] = (val >>> 24) & 0xFF;
            payload[offset++] = (val >>> 16) & 0xFF;
            payload[offset++] = (val >>> 8) & 0xFF;
            payload[offset++] = (val) & 0xFF;
        };

        // write position x and y packed
        writeInt32BE(packPos(x, width));
        writeInt32BE(packPos(y, height));

        // write pressure as float32 big-endian (default to 1.0)
        payload[offset++] = 0x3F; // 1.0f
        payload[offset++] = 0x80;
        payload[offset++] = 0x00;
        payload[offset++] = 0x00;

        // write buttons and actionButton
        writeInt32BE(buttons);
        writeInt32BE(actionButton);

        return payload;
    }

    createScrollProtocolData(x, y, width, height, hScroll, vScroll, button) {
        const messageType = 3; // INJECT_SCROLL per scrcpy ControlMessage
        const payloadLength = 17;
        const payload = new Uint8Array(payloadLength);
        let offset = 0;

        const toInt = (v) => Number.isFinite(v) ? Math.round(v) : 0;
        const clamp16 = (v) => Math.max(0, Math.min(0xFFFF, toInt(v)));
        const packPos = (pos, size) => ((clamp16(pos) & 0xFFFF) << 16) | (clamp16(size) & 0xFFFF);
        const writeInt32BE = (val) => {
            payload[offset++] = (val >>> 24) & 0xFF;
            payload[offset++] = (val >>> 16) & 0xFF;
            payload[offset++] = (val >>> 8) & 0xFF;
            payload[offset++] = (val) & 0xFF;
        };

        payload[offset++] = messageType;
        writeInt32BE(packPos(x, width));
        writeInt32BE(packPos(y, height));
        // scrcpy expects hScroll then vScroll
        writeInt32BE(toInt(hScroll));
        writeInt32BE(toInt(vScroll));

        return payload;
    }

    createKeyProtocolData(action, keycode, repeat, metaState) {
        const type = 0; // key event

        const buffer = new ArrayBuffer(1 + 1 + 4 + 4 + 4);
        const view = new DataView(buffer);

        let offset = 0;

        view.setUint8(offset, type); offset += 1;
        view.setUint8(offset, action); offset += 1;
        view.setInt32(offset, keycode, false); offset += 4;
        view.setInt32(offset, repeat, false); offset += 4;
        view.setInt32(offset, metaState, false);

        return new Uint8Array(buffer);
    }

    createTouchProtocolData(action, x, y, width, height, actionButton, buttons, pressure) {
        const type = 2; // touch event

        const buffer = new ArrayBuffer(1 + 1 + 8 + 4 + 4 + 2 + 2 + 2 + 4 + 4);
        const view = new DataView(buffer);

        let offset = 0;

        view.setUint8(offset, type); offset += 1;
        view.setUint8(offset, action); offset += 1;

        // pointerId: 0xff x7 + 0xfd
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xff); offset += 1;
        view.setUint8(offset, 0xfd); offset += 1;

        view.setInt32(offset, Math.round(x), false); offset += 4;
        view.setInt32(offset, Math.round(y), false); offset += 4;
        view.setUint16(offset, Math.max(0, Math.min(0xFFFF, Math.round(width))), false); offset += 2;
        view.setUint16(offset, Math.max(0, Math.min(0xFFFF, Math.round(height))), false); offset += 2;

        view.setInt16(offset, pressure, false); offset += 2;
        view.setInt32(offset, actionButton, false); offset += 4;
        view.setInt32(offset, buttons, false);

        return new Uint8Array(buffer);
    }

    createScrollProtocolData(x, y, width, height, hScroll, vScroll, button) {
        const type = 3; // scroll event

        const buffer = new ArrayBuffer(1 + 4 + 4 + 2 + 2 + 2 + 2 + 4);
        const view = new DataView(buffer);

        let offset = 0;
        view.setUint8(offset, type); offset += 1;

        view.setInt32(offset, Math.round(x), false); offset += 4;
        view.setInt32(offset, Math.round(y), false); offset += 4;
        view.setUint16(offset, Math.max(0, Math.min(0xFFFF, Math.round(width))), false); offset += 2;
        view.setUint16(offset, Math.max(0, Math.min(0xFFFF, Math.round(height))), false); offset += 2;

        view.setInt16(offset, Math.round(hScroll), false); offset += 2;
        view.setInt16(offset, Math.round(vScroll), false); offset += 2;

        view.setInt32(offset, button || 0, false);

        return new Uint8Array(buffer);
    }

    createScreenProtocolData(action) {
        const messageType = 3;
        const payloadLength = 1;
        const payload = new Uint8Array(payloadLength);

        payload[0] = messageType;
        return payload;
    }

    createPowerProtocolData(action) {
        const messageType = 3;
        const payloadLength = 1;
        const payload = new Uint8Array(payloadLength);

        payload[0] = messageType;
        return payload;
    }

    add_debug_item(text) {
        let outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML += text + "\n";
        }
    }

    screen_on_off(action) {
        const messageType = 5;
        const payloadLength = 1;
        const payload = new Uint8Array(payloadLength);

        payload[0] = action;

        let result = new Uint8Array(2);
        result[0] = messageType;
        result.set(payload, 1);

        this.callback(result);
    }
}