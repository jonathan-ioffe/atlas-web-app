let connectToWebSocket = (ws_conn) => {
    ws_conn.onopen = () => {
        console.log('SUCCESS connecting WebSocket');
        
      }
    ws_conn.onerror = (err) => {
        console.error(`ERROR connecting to WebSocket: ${err}`);
    }
}

export {connectToWebSocket}