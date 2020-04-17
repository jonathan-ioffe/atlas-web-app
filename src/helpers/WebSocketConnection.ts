function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

class WebSocketConnection {
  private _serverAddress: string
  private _wsConnection: WebSocket
  private _timeout: number
  onConnectionOpen: () => void
  receiveMessage: (evt: MessageEvent) => void

  sendMessage = async (
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
  ) => {
    while (!this.isConnected()) {
      await sleep(100)
    }
    console.debug(`Sending: ${data}`)
    this._wsConnection.send(data)
  }

  isConnected = () => {
    return this._wsConnection.readyState === WebSocket.OPEN
  }

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    if (
      !this._wsConnection ||
      this._wsConnection.readyState === WebSocket.CLOSED
    )
      this.connect() //check if websocket instance is closed, if so call `connect` function.
  }

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   * With the help of the following article: https://dev.to/finallynero/using-websockets-in-react-4fkp
   */
  connect = () => {
    let that = this // cache the this
    let connectInterval: any

    // websocket onopen event listener
    this._wsConnection.onopen = () => {
      console.debug('SUCCESS connecting WebSocket')
      this.onConnectionOpen()

      that._timeout = 250 // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval) // clear Interval on on open of websocket connection
    }

    this._wsConnection.onmessage = (evt) => {
      this.receiveMessage(evt)
    }

    // websocket onclose event listener
    this._wsConnection.onclose = (e) => {
      console.log(
        `Connection to ${
          this._serverAddress
        } server closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that._timeout + that._timeout) / 1000,
        )} seconds`,
        e.reason,
      )

      that._timeout = that._timeout + that._timeout //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that._timeout)) //call check function after timeout
    }

    // websocket onerror event listener
    this._wsConnection.onerror = (err) => {
      console.error(
        'Socket encountered error: ',
        err.returnValue,
        'Closing socket',
      )

      this._wsConnection.close()
    }
  }

  constructor(
    serverAddress: string,
    onOpenCallback: () => void,
    onMessageCallback: (evt: MessageEvent) => void,
  ) {
    this._wsConnection = new WebSocket(serverAddress, 'json')
    this._serverAddress = serverAddress
    this._timeout = 250 // Initial timeout duration as a class variable
    this.onConnectionOpen = onOpenCallback
    this.receiveMessage = onMessageCallback
    this.connect()
  }
}

export { WebSocketConnection }
