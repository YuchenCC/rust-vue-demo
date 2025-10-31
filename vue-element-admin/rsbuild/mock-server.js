const path = require('path')

/**
 * 启动 Mock Server（独立运行在 9528 端口）
 * @param {string} projectRoot - 项目根目录路径
 */
function startMockServer(projectRoot) {
    // 路径解析函数
    function resolve(dir) {
        return path.join(projectRoot, dir)
    }

    try {
        console.log('[Mock Server] Starting mock server...')

        // 检查必要的依赖
        let express
        try {
            express = require('express')
            console.log('[Mock Server] ✓ Express loaded successfully')
        } catch (err) {
            console.error('[Mock Server] ✗ Failed to load express:', err.message)
            console.error('[Mock Server] Please run: npm install express')
            return
        }

        // 创建独立的 Express 应用用于 mock server（运行在 9528 端口）
        const mockApp = express()
        console.log('[Mock Server] ✓ Express app created')

        // 检查 mock-server.js 文件是否存在
        const mockServerPath = resolve('mock/mock-server.js')
        const fs = require('fs')
        if (!fs.existsSync(mockServerPath)) {
            console.error(`[Mock Server] ✗ Mock server file not found: ${mockServerPath}`)
            return
        }
        console.log(`[Mock Server] ✓ Mock server file found: ${mockServerPath}`)

        // 加载并应用 mock server 中间件
        let mockServer
        try {
            mockServer = require(mockServerPath)
            console.log('[Mock Server] ✓ Mock server module loaded')
        } catch (err) {
            console.error('[Mock Server] ✗ Failed to load mock-server.js:', err.message)
            console.error('[Mock Server] Error stack:', err.stack)
            return
        }

        // 应用 mock server 中间件
        try {
            mockServer(mockApp)
            console.log('[Mock Server] ✓ Mock server middleware applied')
        } catch (err) {
            console.error('[Mock Server] ✗ Failed to apply mock server middleware:', err.message)
            console.error('[Mock Server] Error stack:', err.stack)
            return
        }

        // 在 9528 端口启动独立的 mock server
        const mockPort = 9528
        try {
            const server = mockApp.listen(mockPort, () => {
                console.log(`\n[Mock Server] ✓ Mock Server running at http://localhost:${mockPort}\n`)
            })

            // 捕获服务器错误
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.error(`[Mock Server] ✗ Port ${mockPort} is already in use`)
                    console.error(`[Mock Server] Please check if another mock server is running on port ${mockPort}`)
                } else {
                    console.error(`[Mock Server] ✗ Server error:`, err.message)
                    console.error('[Mock Server] Error details:', err)
                }
            })

        } catch (err) {
            console.error('[Mock Server] ✗ Failed to start server:', err.message)
            console.error('[Mock Server] Error stack:', err.stack)
        }

    } catch (err) {
        console.error('[Mock Server] ✗ Unexpected error during mock server setup:', err.message)
        console.error('[Mock Server] Error stack:', err.stack)
        console.error('[Mock Server] Full error:', err)
    }
}

module.exports = startMockServer

