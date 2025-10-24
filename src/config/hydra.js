import { Configuration, OAuth2Api } from "@ory/client-fetch"

const hydra = new OAuth2Api(
  new Configuration({
    basePath: process.env.HYDRA_ADMIN_URL || "http://localhost:4445",
  })
)

export default hydra
