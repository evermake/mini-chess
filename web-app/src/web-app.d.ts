declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    Telegram: {
      WebApp: WebApp
    }
  }
}

export type WebApp = {
  initData: string
  initDataUnsafe: WebAppInitData
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: ThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean

  BackButton: BackButton
  MainButton: MainButton
  HapticFeedback: HapticFeedback
  CloudStorage: CloudStorage

  isVersionAtLeast(minimumVersion: VersionHints): boolean
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  enableClosingConfirmation(): void
  disableClosingConfirmation(): void
  onEvent<E extends WebAppEvent = never>(event: E, handler: WebAppEventHandlers[E]): void
  offEvent<E extends WebAppEvent = never>(event: E, handler: WebAppEventHandlers[E]): void
  sendData(data: string): never
  switchInlineQuery(query: string, choose_chat_types?: ("users" | "bots" | "groups" | "channels")[]): void
  openLink(url: string, options?: { try_instant_view?: boolean }): void
  openTelegramLink(url: string): never
  openInvoice(url: string, callback?: (invoiceStatus: InvoiceStatus) => void): void
  showPopup(params: PopupParams, callback?: (pressedButtonId: string | null) => void): void
  showAlert(message: string, callback?: () => void): void
  showConfirm(message: string, callback?: (ok: boolean) => void): void
  showScanQrPopup(params: ScanQrPopupParams, callback?: (data: string) => boolean): void
  closeScanQrPopup(): void
  readTextFromClipboard(callback?: (data: string | null) => void): void
  requestWriteAccess(callback?: (accessGranted: boolean) => void): void
  requestContact(callback?: (contactShared: boolean) => void): void

  ready(): void
  expand(): void
  close(): never
}

export type WebAppInitData =
  | {
    auth_date: number
    hash: string
    query_id?: string
    user?: WebAppUser
    receiver?: WebAppUser
    chat?: WebAppChat
    chat_type?: "sender" | "private" | "group" | "supergroup" | "channel"
    chat_instance?: string
    start_param?: string
    can_send_after?: number
  }
  | Record<string | number | symbol, never>

export type WebAppUser = {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  is_premium?: true
  added_to_attachment_menu?: true
  allows_write_to_pm?: true
  photo_url?: string
}

export type WebAppChat = {
  id: number
  type: "group" | "supergroup" | "channel"
  title: string
  username?: string
  photo_url?: string
}

export type ThemeParams = {
  bg_color: string
  text_color: string
  hint_color: string
  link_color: string
  button_color: string
  button_text_color: string
  secondary_bg_color: string
}

export type BackButton = {
  isVisible: boolean
  onClick(callback: WebAppEventHandlers["backButtonClicked"]): BackButton
  offClick(callback: WebAppEventHandlers["backButtonClicked"]): BackButton
  show(): BackButton
  hide(): BackButton
}

export type MainButton = {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: Readonly<boolean>
  setText(text: string): MainButton
  onClick(callback: WebAppEventHandlers["mainButtonClicked"]): MainButton
  offClick(callback: WebAppEventHandlers["mainButtonClicked"]): MainButton
  show(): MainButton
  hide(): MainButton
  enable(): MainButton
  disable(): MainButton
  showProgress(leaveActive?: boolean): MainButton
  hideProgress(): MainButton
  setParams(params: {
    text?: string
    color?: string
    text_color?: string
    is_active?: boolean
    is_visible?: boolean
  }): MainButton
}

export type HapticFeedback = {
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): HapticFeedback
  notificationOccurred(type: "error" | "success" | "warning"): HapticFeedback
  selectionChanged(): HapticFeedback
}

export type CloudStorage = {
  setItem(
    key: string,
    value: string,
    callback?: (error: Error | null, stored?: boolean) => void,
  ): CloudStorage
  getItem(
    key: string,
    callback: (error: Error | null, value?: string) => void,
  ): CloudStorage
  getItems(
    keys: string[],
    callback: (error: Error | null, values?: string[]) => void,
  ): CloudStorage
  removeItem(
    key: string,
    callback: (error: Error | null, removed?: boolean) => void,
  ): CloudStorage
  removeItems(
    keys: string[],
    callback: (error: Error | null, removed?: boolean) => void,
  ): CloudStorage
  getKeys: (
    callback: (error: Error | null, keys?: string[]) => void,
  ) => CloudStorage
}

export type WebAppEvent =
  | "themeChanged"
  | "viewportChanged"
  | "mainButtonClicked"
  | "backButtonClicked"
  | "settingsButtonClicked"
  | "invoiceClosed"
  | "popupClosed"
  | "qrTextReceived"
  | "clipboardTextReceived"
  | "writeAccessRequested"
  | "contactRequested"

export type WebAppEventHandlers = {
  themeChanged: () => void
  viewportChanged: (event: { isStateStable: boolean }) => void
  mainButtonClicked: () => void
  backButtonClicked: () => void
  settingsButtonClicked: () => void
  invoiceClosed: (event: { url: string; status: InvoiceStatus }) => void
  popupClosed: (event: { button_id: string | null }) => void
  qrTextReceived: (event: { data: string }) => void
  clipboardTextReceived: (event: { data: string | null }) => void
  writeAccessRequested: (event: { status: "allowed" | "cancelled" }) => void
  contactRequested: (event: { status: "sent" | "cancelled" }) => void
}

export type PopupParams = {
  title?: string
  message: string
  buttons?: PopupButton[]
}

export type PopupButton =
  | {
    id?: string
    text: string
  }
  | {
    id?: string
    type: "default" | "destructive"
    text: string
  }
  | {
    id?: string
    type: "ok" | "close" | "cancel"
    text?: string
  }

export type ScanQrPopupParams = {
  text?: string
}

export type InvoiceStatus = "paid" | "cancelled" | "failed" | "pending"

// eslint-disable-next-line ts/ban-types
type VersionHints = "6.1" | "6.2" | "6.4" | "6.7" | "6.9" | string & {}
