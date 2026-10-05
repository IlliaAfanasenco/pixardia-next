self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/(?<nxtPlocale>[^/]+?)(?:/.*)?"
          }
        ],
        "source": "/:nxtPlocale/projects/:nxtPslug",
        "destination": "/:nxtPlocale/(.)projects/:nxtPslug"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()