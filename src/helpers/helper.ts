export const retriveLocalStorageData = <T,>(key:string)=>{
    const pairJSON = localStorage.getItem(key) || '';
    if(!pairJSON){
        return {} as T;
    }
    let tokenRefreshPair = JSON.parse(pairJSON);
    return tokenRefreshPair as T;

}