import * as React from 'react'
import {
  LiffDecodedProfile,
  LIFFConfig,
  LiffInitErrorCallback,
  LiffInitSuccessCallback,
  LiffInitSuccessData,
} from 'liff-type'
import { importByScriptTag } from './importByScriptTag'

// decodedProfileから期限が切れているかチェックする関数
const isExpiredToken = (decodedProfile: LiffDecodedProfile): boolean => {
  const nowUnixTime = new Date().getTime() / 1000
  return nowUnixTime > decodedProfile.exp
}

export const useLIFF: (
  config: LIFFConfig,
  initSuccessCallback?: LiffInitSuccessCallback,
  errorCallback?: LiffInitErrorCallback
) => void = (config, initSuccessCallback, errorCallback) => {
  React.useEffect(() => {
    importByScriptTag('https://static.line-scdn.net/liff/edge/2/sdk.js').then(
      () => {
        liff.init(
          config,
          (data: LiffInitSuccessData): void => {
            ;(async () => {
              // LIFFで取得できるIDトークンは自動で更新されないので、期限が切れてたらログアウトする
              if (liff.isLoggedIn()) {
                const decodedProfile = await liff.getDecodedIDToken()
                if (isExpiredToken(decodedProfile)) {
                  liff.logout()
                }
              }

              if (initSuccessCallback) {
                initSuccessCallback(data)
              }
            })()
          },
          errorCallback
        )
      }
    )
  }, [])
}
