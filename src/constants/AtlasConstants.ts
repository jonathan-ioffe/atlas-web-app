export const AtlasServerAddress = `wss://atlas-server.cs.tau.ac.il:6789`;
export const MessageClassName = {
    UserAuthRequest: "tau.atlas.connections.UserAuthenticationRequest",
    UserAuthResponse: "tau.atlas.connections.UserAuthenticationResponse",
    Connection: "tau.atlas.messages.ConsumerConnectionStateExtended",
    Localization: "tau.atlas.messages.LocalizationMessage",
    Detection: "tau.atlas.messages.DetectionMessage",
    TagSummary: "tau.atlas.messages.TagSummaryMessage",
    SystemStructure: "tau.atlas.messages.SystemStructureMessage",
    GpsLocalization: "tau.atlas.messages.GPSLocalizationMessage"
}
