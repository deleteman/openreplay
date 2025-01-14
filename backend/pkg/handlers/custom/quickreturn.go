package custom
import (
    . "openreplay/backend/pkg/messages"
)
type QuickReturnDetector struct {
    timestamp   uint64
    currentPage string
    lastPage    string
}
// If received SetPageLocation on same 
func (h *QuickReturnDetector) HandleSetPageLocation(msg *SetPageLocation, messageID uint64, timestamp uint64) Message {
    if (h.timestamp + 5000 >= timestamp && h.lastPage == msg.URL) {
        h.timestamp = msg.NavigationStart
        return h.Build()
    }
    h.lastPage = h.currentPage
    h.currentPage = msg.URL
    h.timestamp = msg.NavigationStart
    return nil
}
// detect when a button is clicked (selector must have string 'button' in it)
func (h *QuickReturnDetector) HandleMouseClick(msg *MouseClick, messageID uint64, timestamp uint64) {
    h.timestamp = timestamp
}
func (h *QuickReturnDetector) Handle(message Message, messageID uint64, timestamp uint64) Message {
    switch msg := message.(type) {
    case *SetPageLocation:
        if msg.NavigationStart != 0 {
            return h.HandleSetPageLocation(msg, messageID, timestamp)
        }
    case *MouseClick:
        h.HandleMouseClick(msg, messageID, timestamp)
    }
    return nil
}
func (h *QuickReturnDetector) Build() Message {
    event := &CustomEvent {
        Name:   "quickreturn",
        Payload:    h.currentPage,
    }
    return event
}