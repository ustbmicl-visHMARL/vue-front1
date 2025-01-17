// src/composables/useRos.ts
import ROSLIB from 'roslib';


let ros: ROSLIB.Ros | null = null;  // 单一的 ROS 连接

// 创建 ROS 连接的函数，支持传入 IP 地址
export function createRosConnection(ip: string): ROSLIB.Ros {

    // 如果传入了 IP 地址，或者当前没有连接，创建新的连接
    const url = `ws://${ip}:9090`;

    // 如果 ros 为空或者 IP 地址不同，则创建新的连接

    ros = new ROSLIB.Ros({
        url: url,  // 根据 IP 动态设置 URL
    });
}

export function getRosConnection(): ROSLIB.Ros {
    if (!ros) {
        createRosConnection('localhost');
    }
    return ros;
}

export function closeRosConnection(): void {
    if (ros) {
        ros.close();
        ros = null;
    }
}