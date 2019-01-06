//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let bg:egret.Shape = new egret.Shape();
        // bg.graphics.beginFill( 0x000000, 0.5 );
        bg.graphics.beginFill( 0x336699 );
        bg.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight ); 
        bg.graphics.endFill();
        this.addChild(bg);

        var tx:egret.TextField = new egret.TextField();
        tx.text = "I'm Jack, I will use Egret create a fantasy mobile game!"; 
        tx.size = 32;
        tx.x = 20;
        tx.y = 20;
        tx.width = this.stage.stageWidth - 40;
        this.addChild( tx );

        tx.touchEnabled = true;
        tx.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent ): void => {
           tx.textColor = 0x00ff00;
        }, this );

        var batman:egret.Bitmap = new egret.Bitmap( RES.getRes('hexo-huaheshang_png'));
        batman.x = 0;
        batman.y = 60;
        this.addChild( batman );

        var batman1:egret.Bitmap = new egret.Bitmap( RES.getRes('hexo-huaheshang_png'));
        batman1.x = 100;
        batman1.y = 60;
        this.addChild( batman1 );

        
        
       
       this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        egret.Tween.get(batman).to({x: batman1.x}, 300, egret.Ease.circIn )
        egret.Tween.get(batman1).to({x: batman.x}, 300, egret.Ease.circIn )
      
        egret.Tween.get( batman1 ).to( {scaleX: .4, scaleY:.4, alpha: .3}, 300, egret.Ease.circIn).to({scaleX: 1, scaleY: 1, alpha: 1}, 300, egret.Ease.circIn)
        var sound:egret.Sound = RES.getRes('jimp_mp3'); sound.play();
        
       }, this);

       var urlreq:egret.URLRequest = new egret.URLRequest('http://httpbin.org/user-agent');
       
       var urlloader:egret.URLLoader = new egret.URLLoader;
       urlloader.addEventListener( egret.Event.COMPLETE, (evt:egret.Event):void => {
           console.log(evt.target.data);
       }, this)
       urlloader.load( urlreq );

        this.webSocket = new egret.WebSocket();
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.webSocket.connect('echo.websocket.org', 80)

    }

    private webSocket:egret.WebSocket;
    // private createGameScene():void {
    //     this.webSocket = new egret.WebSocket();
    //     this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    //     this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    //     this.webSocket.connect('echo.websocket.org', 80)
    // }
    private onSocketOpen():void {
        var cmd = 'hello Egret webSocket'; console.log('The connection id successful, send data:' + cmd);
        this.webSocket.writeUTF(cmd);
    }
    private onReceiveMessage(e: egret.Event):void {
        var msg = this.webSocket.readUTF();
        console.log("Receive data: " + msg)
    }
}