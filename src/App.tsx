import { useMemo, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  CircleDot,
  CreditCard,
  Download,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Send,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { workspaceData, useWorkspaceStore } from '@/store/useWorkspaceStore'

const quoteStatuses = ['Draft', 'Sent', 'Accepted', 'Deposit Paid', 'Confirmed'] as const

function currency(value: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value)
}

function LoginScreen() {
  const login = useWorkspaceStore((state) => state.login)

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Visual Impact South Africa</p>
          <CardTitle>Project Workspace Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-600">Choose a prototype role to continue.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={() => login('client')}>Login as Client</Button>
            <Button variant="secondary" onClick={() => login('staff')}>Login as Staff</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default function App() {
  const [messageDraft, setMessageDraft] = useState('')
  const [syncNotice, setSyncNotice] = useState('')
  const {
    isLoggedIn,
    userType,
    logout,
    quoteStatus,
    setQuoteStatus,
    termsAccepted,
    setTermsAccepted,
    chat,
    sendMessage,
    selectedKitIds,
    toggleKitSelection,
    syncQuoteEmailRepliesToChat,
  } = useWorkspaceStore()

  const grouped = useMemo(() => {
    return workspaceData.kitItems.reduce<Record<string, typeof workspaceData.kitItems>>((acc, item) => {
      acc[item.category] = [...(acc[item.category] ?? []), item]
      return acc
    }, {})
  }, [])

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  const subtotal = workspaceData.kitItems.reduce((sum, item) => sum + item.dailyRate * item.quantity, 0)
  const net = subtotal - workspaceData.quote.discount + workspaceData.quote.delivery
  const vat = net * workspaceData.quote.vatRate
  const total = net + vat
  const deposit = total * 0.3
  const finalAmount = total - deposit

  return (
    <main className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between">
        <Badge>{userType === 'client' ? 'Client View' : 'Internal Staff View'}</Badge>
        <Button variant="ghost" onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Visual Impact South Africa · Project Workspace</p>
                  <CardTitle>Rental Kit Assembly · Cape Town Brand Film</CardTitle>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700">{quoteStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-zinc-500">Quote Number</p>
                <p className="font-semibold">{workspaceData.quote.number}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-zinc-500">Current Job Status</p>
                <p className="font-semibold">{workspaceData.timeline.at(-1)?.label}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-zinc-500">Alerts</p>
                <p className="flex items-center gap-1 font-semibold"><Bell className="h-4 w-4" /> New revision request</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Assembled Rental Kit (Interactive)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold">{category}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.map((item) => {
                      const selected = selectedKitIds.includes(item.id)
                      return (
                        <article key={item.id} className={`grid grid-cols-[88px_1fr] gap-3 rounded-lg border p-2 ${selected ? 'border-sky-500 ring-1 ring-sky-400' : ''}`}>
                          <img src={item.image} alt={item.name} className="h-[88px] w-[88px] rounded-md object-cover" />
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-zinc-500">{item.brand} {item.model} · Qty {item.quantity}</p>
                            <p>Serial: {item.serial}</p>
                            <p>Rate: {currency(item.dailyRate)} / day · Replacement: {currency(item.replacementValue)}</p>
                            <p className="text-xs text-zinc-500">{item.condition}</p>
                            <Button variant={selected ? 'default' : 'outline'} className="mt-1" onClick={() => toggleKitSelection(item.id)}>
                              {selected ? 'Selected for change request' : 'Select for discussion'}
                            </Button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Terms, Quote, Payment & Revisions</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Rental Terms</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {workspaceData.terms.map((term) => <li key={term}>{term}</li>)}
                </ul>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                  I acknowledge these terms in this prototype
                </label>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download terms PDF</Button>
              </div>

              <div className="space-y-3 text-sm">
                <h4 className="font-semibold">Quote Summary</h4>
                <p className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></p>
                <p className="flex justify-between"><span>Discount</span><span>-{currency(workspaceData.quote.discount)}</span></p>
                <p className="flex justify-between"><span>Delivery</span><span>{currency(workspaceData.quote.delivery)}</span></p>
                <p className="flex justify-between"><span>VAT</span><span>{currency(vat)}</span></p>
                <p className="flex justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{currency(total)}</span></p>
                <div className="flex flex-wrap gap-2">
                  {quoteStatuses.map((status) => (
                    <Button key={status} variant={quoteStatus === status ? 'default' : 'outline'} onClick={() => setQuoteStatus(status)}>{status}</Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button>Accept Quote</Button>
                  <Button
                    variant="secondary"
                    onClick={() => sendMessage(`Requested kit changes for items: ${selectedKitIds.join(', ') || 'none selected'}`)}
                  >
                    Request Changes
                  </Button>
                  <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download quote PDF</Button>
                </div>
              </div>

              <div className="space-y-2 rounded-md border p-3 md:col-span-2">
                <h4 className="font-semibold">Credit Card Payment</h4>
                <p className="text-sm text-zinc-600">Client can pay deposit or final balance by card in this prototype flow.</p>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="rounded border p-2">Deposit (30%): <strong>{currency(deposit)}</strong></p>
                  <p className="rounded border p-2">Final amount: <strong>{currency(finalAmount)}</strong></p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => sendMessage(`Card payment initiated for deposit (${currency(deposit)}).`, 'system')}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Deposit by Card
                  </Button>
                  <Button variant="secondary" onClick={() => sendMessage(`Card payment initiated for final amount (${currency(finalAmount)}).`, 'system')}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Final Amount by Card
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="mb-2 font-semibold">Revision History (who changed what on whose request)</h4>
                <div className="space-y-2 text-sm">
                  {workspaceData.revisionLog.map((entry) => (
                    <div key={entry.id} className="rounded-md border p-2">
                      <p className="font-medium">{entry.label}</p>
                      <p className="text-zinc-500">{entry.at} · {entry.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CircleDot className="h-4 w-4" /> Status Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {workspaceData.timeline.map((entry) => (
                <div key={entry.id} className="border-l-2 border-zinc-200 pl-3">
                  <p className="font-medium">{entry.label}</p>
                  <p className="text-zinc-500">{entry.at}</p>
                  <p className="text-zinc-500">{entry.actor}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Download timeline PDF</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Project Chat</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-3 rounded-md border border-dashed p-2 text-xs text-zinc-600">
                <p className="mb-2 flex items-center gap-2"><Mail className="h-4 w-4" /> Email replies with quote number in subject appear in chat.</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const syncedCount = syncQuoteEmailRepliesToChat()
                    setSyncNotice(syncedCount > 0 ? `${syncedCount} email reply linked to chat.` : 'No new quote-email replies found.')
                  }}
                >
                  Sync Quote Email Replies
                </Button>
                {syncNotice && <p className="mt-2">{syncNotice}</p>}
              </div>

              <div className="mb-3 max-h-96 space-y-2 overflow-auto pr-1">
                {chat.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-3 text-sm ${
                      m.role === 'client' ? 'ml-8 bg-sky-50' : m.role === 'system' ? 'border border-amber-300 bg-amber-50' : 'mr-8 bg-zinc-100'
                    }`}
                  >
                    <p className="font-medium">{m.from}</p>
                    <p>{m.text}</p>
                    {m.attachment && <p className="mt-1 text-xs text-sky-700">Attachment: {m.attachment}</p>}
                    <p className="mt-1 text-xs text-zinc-500">{m.time} · Read by: {m.readBy.join(', ') || 'Not yet read'}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="Message employees about this quote/project..."
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (!messageDraft.trim()) return
                    sendMessage(messageDraft.trim(), userType === 'staff' ? 'employee' : 'client')
                    setMessageDraft('')
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><CheckCircle2 className="h-4 w-4" /> Read indicators enabled · Typing indicators disabled</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
