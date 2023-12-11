import { login, logout, getInfo, ADLogin } from '@/api/login';
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth';
import defAva from '@/assets/images/profile.jpg';
import { defineStore } from 'pinia';
import { SessionStorage } from '@zeronejs/utils';

const useUserStore = defineStore('user', {
    state: (): {
        token?: string;
        name: string;
        nameT: string;
        avatar: string;
        roles: any[];
        permissions: string[];
    } => ({
        token: getToken(),
        nameT: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
    }),
    actions: {
        // 登录
        login(userInfo: { username: string; password: string; appId: string; code: string; uuid: string }) {
            const username = userInfo.username.trim();
            const password = userInfo.password;
            const appId = userInfo.appId;
            const code = userInfo.code;
            const uuid = userInfo.uuid;
            return new Promise((resolve, reject) => {
                login(username, password, appId, code, uuid)
                    .then((res: any) => {
                        setToken(res.token);
                        this.token = res.token;
                        resolve(1);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        ADlogin(userInfo: { appId: string; code: string; username: string; password: string }) {
            const obj = {
                appId: userInfo.appId.trim(),
                code: '',
                password: userInfo.password,
                username: userInfo.username
            }
            return new Promise((resolve, reject) => {
                ADLogin(obj).then(({ data }) => {
                    console.log(data);
                    setToken(data.access_token)
                    this.token = data.access_token;
                    setExpiresIn(data.expires_in)
                    sessionStorage.setItem('line', 'q2rr14')
                    // commit('SET_EXPIRES_IN', data.expires_in)
                    resolve(1)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then((res: any) => {
                        const user = res.user;
                        const avatar =
                            user.avatar === '' || user.avatar == null
                                ? defAva
                                : import.meta.env.VITE_APP_BASE_API + user.avatar;

                        if (res.roles && res.roles.length > 0) {
                            // 验证返回的roles是否是一个非空数组
                            this.roles = res.roles;
                            this.permissions = res.permissions;
                        } else {
                            this.roles = ['ROLE_DEFAULT'];
                        }
                        this.name = user.userName;
                        this.nameT = user.nickName;
                        this.avatar = avatar;
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 退出系统
        logOut() {
            return new Promise((resolve, reject) => {
                logout()
                    .then(() => {
                        this.token = '';
                        this.roles = [];
                        this.permissions = [];
                        removeToken();
                        sessionStorage.removeItem('line')
                        resolve(1);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    },
});

export default useUserStore;
