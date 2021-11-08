import asyncio
import json
import logging
import websockets

logging.basicConfig()

USERS = set()

def message_event(sender, message):
    return json.dumps({"type": "message", "sender": sender, "message": message})

def info_event(message):
    return json.dumps({"type": "info", "message": message})

def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})

async def chat(websocket, path):
    try:
        # Register user
        USERS.add(websocket)

        # Send current state to user
        await websocket.send(info_event("Hello, please be friendly :)"))

        # Manage state changes
        async for message in websocket:
            data = json.loads(message)
            websockets.broadcast(USERS, message_event("Someone", "Something"))


    finally:
        # Unregister user
        USERS.remove(websocket)
        websockets.broadcast(USERS, users_event())



async def main():
    async with websockets.serve(chat, "localhost", 6789):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())