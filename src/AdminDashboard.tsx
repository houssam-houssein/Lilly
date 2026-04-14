import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BeverageRow } from './beveragesMenuData'
import type { DescLine, SaladLine, SimpleLine } from './menuPage2Data'
import { useMenuCatalogContext } from './MenuCatalogContext'
import type { MenuItem } from './types'
import './AdminDashboard.css'

const ADMIN_SESSION_KEY = 'lily-admin-session-v1'

function PinGate({ children }: { children: ReactNode }) {
  const configuredUser = import.meta.env.VITE_ADMIN_USERNAME?.trim()
  const configuredPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim()
  const configuredPin = import.meta.env.VITE_ADMIN_PIN?.trim()
  const useLogin = Boolean(configuredUser && configuredPassword)
  const [unlocked, setUnlocked] = useState(() => {
    if (!useLogin && !configuredPin) return true
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  })
  const [userInput, setUserInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState(false)

  if ((!useLogin && !configuredPin) || unlocked) {
    return <>{children}</>
  }

  return (
    <div className="admin-pin">
      <form
        className="admin-pin-form"
        onSubmit={(e) => {
          e.preventDefault()
          const isValid = useLogin
            ? userInput === configuredUser && passwordInput === configuredPassword
            : pinInput === configuredPin
          if (isValid) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
            setUnlocked(true)
            setError(false)
          } else {
            setError(true)
          }
        }}
      >
        <h1 className="admin-pin-title">Admin Dashboard</h1>
        <p className="admin-pin-hint">
          {useLogin ? (
            <>
              Enter credentials from your build configuration (
              <code>VITE_ADMIN_USERNAME</code> and <code>VITE_ADMIN_PASSWORD</code>
              ). This is client-side only and not fully secure.
            </>
          ) : (
            <>
              Enter the PIN from your build configuration (<code>VITE_ADMIN_PIN</code>
              ). This is client-side only and not fully secure.
            </>
          )}
        </p>
        {useLogin ? (
          <>
            <label className="admin-pin-label">
              Username
              <input
                className="admin-pin-input"
                type="text"
                autoComplete="username"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value)
                  setError(false)
                }}
              />
            </label>
            <label className="admin-pin-label">
              Password
              <input
                className="admin-pin-input"
                type="password"
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setError(false)
                }}
              />
            </label>
          </>
        ) : (
          <label className="admin-pin-label">
            PIN
            <input
              className="admin-pin-input"
              type="password"
              autoComplete="off"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value)
                setError(false)
              }}
            />
          </label>
        )}
        {error ? (
          <p className="admin-pin-error">
            {useLogin ? 'Incorrect username or password.' : 'Incorrect PIN.'}
          </p>
        ) : null}
        <button type="submit" className="admin-btn admin-btn--primary">
          Log in
        </button>
      </form>
    </div>
  )
}

type AdminTab = string
type RequestDelete = (onConfirm: () => void, message?: string) => void

function AdminSimpleSection({
  title,
  rows,
  onChange,
  requestDelete,
}: {
  title: string
  rows: SimpleLine[]
  onChange: (rows: SimpleLine[]) => void
  requestDelete: RequestDelete
}) {
  const patch = (id: string, patchRow: Partial<SimpleLine>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
  }
  const add = () =>
    onChange([
      ...rows,
      { id: `row-${Date.now()}`, name: '', price: 0 },
    ])
  const del = (id: string) => onChange(rows.filter((r) => r.id !== id))

  return (
    <section className="admin-block">
      <h2 className="admin-block-title">{title}</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="admin-cell-input"
                    value={row.name}
                    onChange={(e) => patch(row.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="admin-cell-input admin-cell-input--num"
                    type="number"
                    step={10_000}
                    value={row.price}
                    onChange={(e) =>
                      patch(row.id, {
                        price:
                          e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => {
                      requestDelete(() => del(row.id))
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="admin-btn admin-btn--mt" onClick={add}>
        Add row
      </button>
    </section>
  )
}

function AdminStartersSection({
  leftRows,
  rightRows,
  note,
  onChangeLeft,
  onChangeRight,
  onChangeNote,
  requestDelete,
}: {
  leftRows: SimpleLine[]
  rightRows: SimpleLine[]
  note: string
  onChangeLeft: (rows: SimpleLine[]) => void
  onChangeRight: (rows: SimpleLine[]) => void
  onChangeNote: (note: string) => void
  requestDelete: RequestDelete
}) {
  const combined = [
    ...leftRows.map((row) => ({ ...row, side: 'left' as const })),
    ...rightRows.map((row) => ({ ...row, side: 'right' as const })),
  ]

  const patch = (id: string, side: 'left' | 'right', patchRow: Partial<SimpleLine>) => {
    if (side === 'left') {
      onChangeLeft(leftRows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
    } else {
      onChangeRight(rightRows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
    }
  }

  const del = (id: string, side: 'left' | 'right') => {
    if (side === 'left') onChangeLeft(leftRows.filter((r) => r.id !== id))
    else onChangeRight(rightRows.filter((r) => r.id !== id))
  }

  const addStarter = () => {
    const next: SimpleLine = {
      id: `starter-${Date.now()}`,
      name: '',
      price: 0,
    }
    // Auto place in the side with more available space (fewer items).
    if (leftRows.length <= rightRows.length) onChangeLeft([...leftRows, next])
    else onChangeRight([...rightRows, next])
  }

  return (
    <section className="admin-block">
      <h2 className="admin-block-title">Starters</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Side</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {combined.map((row) => (
              <tr key={`${row.side}-${row.id}`}>
                <td>
                  <input
                    className="admin-cell-input"
                    value={row.name}
                    onChange={(e) => patch(row.id, row.side, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="admin-cell-input admin-cell-input--num"
                    type="number"
                    step={10_000}
                    value={row.price}
                    onChange={(e) =>
                      patch(row.id, row.side, {
                        price: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <span className="admin-side-badge">
                    {row.side === 'left' ? 'Left' : 'Right'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => requestDelete(() => del(row.id, row.side))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="admin-btn admin-btn--mt" onClick={addStarter}>
        Add starter
      </button>
      <label className="admin-inline-field">
        Starters note
        <input
          className="admin-cell-input admin-inline-input-wide"
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
        />
      </label>
    </section>
  )
}

function AdminDescSection({
  title,
  rows,
  onChange,
  requestDelete,
}: {
  title: string
  rows: DescLine[]
  onChange: (rows: DescLine[]) => void
  requestDelete: RequestDelete
}) {
  const patch = (id: string, patchRow: Partial<DescLine>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
  }
  const add = () =>
    onChange([
      ...rows,
      {
        id: `row-${Date.now()}`,
        name: '',
        price: 0,
        description: '',
      },
    ])
  const del = (id: string) => onChange(rows.filter((r) => r.id !== id))

  return (
    <section className="admin-block">
      <h2 className="admin-block-title">{title}</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="admin-col-price">Price</th>
              <th className="admin-col-salad-desc">Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="admin-cell-input"
                    value={row.name}
                    onChange={(e) => patch(row.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="admin-cell-input admin-cell-input--num"
                    type="number"
                    step={10_000}
                    value={row.price}
                    onChange={(e) =>
                      patch(row.id, {
                        price:
                          e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <textarea
                    className="admin-cell-textarea"
                    rows={2}
                    value={row.description}
                    onChange={(e) =>
                      patch(row.id, { description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => {
                      requestDelete(() => del(row.id))
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="admin-btn admin-btn--mt" onClick={add}>
        Add row
      </button>
    </section>
  )
}

function AdminSaladsSection({
  rows,
  onChange,
  requestDelete,
}: {
  rows: SaladLine[]
  onChange: (rows: SaladLine[]) => void
  requestDelete: RequestDelete
}) {
  const patchSalad = (id: string, patchRow: Partial<SaladLine>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
  }
  const addSalad = () =>
    onChange([
      ...rows,
      {
        id: `salad-${Date.now()}`,
        name: '',
        price: 0,
        description: '',
        addOns: rows[0]?.addOns?.map((a) => ({ ...a })),
      },
    ])
  const delSalad = (id: string) => onChange(rows.filter((r) => r.id !== id))
  const sharedAddOns = rows.find((r) => r.addOns && r.addOns.length > 0)?.addOns ?? []
  const setSharedAddOns = (addOns: { name: string; price: number }[]) => {
    onChange(
      rows.map((r) => ({
        ...r,
        addOns: addOns.length > 0 ? addOns : undefined,
      }))
    )
  }

  return (
    <section className="admin-block">
      <h2 className="admin-block-title">Salads</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              return (
                <tr key={row.id}>
                  <td>
                    <input
                      className="admin-cell-input"
                      value={row.name}
                      onChange={(e) => patchSalad(row.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="admin-col-price">
                    <input
                      className="admin-cell-input admin-cell-input--num admin-price-input"
                      type="number"
                      step={10_000}
                      value={row.price}
                      onChange={(e) =>
                        patchSalad(row.id, {
                          price: e.target.value === '' ? 0 : Number(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="admin-col-salad-desc">
                    <textarea
                      className="admin-cell-textarea admin-cell-textarea--wide"
                      rows={2}
                      value={row.description}
                      onChange={(e) =>
                        patchSalad(row.id, { description: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-btn admin-btn--small admin-btn--danger"
                      onClick={() => {
                        requestDelete(() => delSalad(row.id))
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button type="button" className="admin-btn admin-btn--mt" onClick={addSalad}>
        Add salad
      </button>
      <section className="admin-block admin-btn--mt">
        <h3 className="admin-block-title">Salad add-ons (shared for all salads)</h3>
        <div className="admin-salad-card">
          {sharedAddOns.map((addon, idx) => (
            <div key={`shared-ao-${idx}`} className="admin-addon-row">
              <input
                className="admin-cell-input"
                placeholder="Name"
                value={addon.name}
                onChange={(e) => {
                  const next = [...sharedAddOns]
                  next[idx] = { ...next[idx], name: e.target.value }
                  setSharedAddOns(next)
                }}
              />
              <input
                className="admin-cell-input admin-cell-input--num"
                type="number"
                step={10_000}
                placeholder="Price"
                value={addon.price}
                onChange={(e) => {
                  const next = [...sharedAddOns]
                  next[idx] = {
                    ...next[idx],
                    price: e.target.value === '' ? 0 : Number(e.target.value),
                  }
                  setSharedAddOns(next)
                }}
              />
              <button
                type="button"
                className="admin-btn admin-btn--small admin-btn--danger"
                onClick={() => {
                  requestDelete(() => {
                    const next = sharedAddOns.filter((_, i) => i !== idx)
                    setSharedAddOns(next)
                  }, 'Are you sure you want to remove this add-on?')
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--small admin-btn--mt"
            onClick={() => setSharedAddOns([...sharedAddOns, { name: '', price: 0 }])}
          >
            Add add-on
          </button>
        </div>
      </section>
    </section>
  )
}

function AdminBevSection({
  title,
  rows,
  columns,
  onChange,
  requestDelete,
}: {
  title: string
  rows: BeverageRow[]
  columns: 'sml' | 'ml'
  onChange: (rows: BeverageRow[]) => void
  requestDelete: RequestDelete
}) {
  const patch = (id: string, patchRow: Partial<BeverageRow>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patchRow } : r)))
  }
  const add = () =>
    onChange([...rows, { id: `bev-${Date.now()}`, name: '' }])
  const del = (id: string) => onChange(rows.filter((r) => r.id !== id))

  const opt = (n: number | undefined) => (n === undefined ? '' : n)
  const parseOpt = (s: string): number | undefined =>
    s === '' ? undefined : Number(s)

  return (
    <section className="admin-block">
      <h2 className="admin-block-title">{title}</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              {columns === 'sml' ? (
                <>
                  <th>Small</th>
                  <th>Medium</th>
                  <th>Large</th>
                </>
              ) : (
                <>
                  <th>Medium</th>
                  <th>Large</th>
                </>
              )}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="admin-cell-input"
                    value={row.name}
                    onChange={(e) => patch(row.id, { name: e.target.value })}
                  />
                </td>
                {columns === 'sml' ? (
                  <>
                    <td>
                      <input
                        className="admin-cell-input admin-cell-input--num"
                        type="number"
                        step={10_000}
                        value={opt(row.small)}
                        onChange={(e) =>
                          patch(row.id, { small: parseOpt(e.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-cell-input admin-cell-input--num"
                        type="number"
                        step={10_000}
                        value={opt(row.medium)}
                        onChange={(e) =>
                          patch(row.id, { medium: parseOpt(e.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-cell-input admin-cell-input--num"
                        type="number"
                        step={10_000}
                        value={opt(row.large)}
                        onChange={(e) =>
                          patch(row.id, { large: parseOpt(e.target.value) })
                        }
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <input
                        className="admin-cell-input admin-cell-input--num"
                        type="number"
                        step={10_000}
                        value={opt(row.medium)}
                        onChange={(e) =>
                          patch(row.id, { medium: parseOpt(e.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-cell-input admin-cell-input--num"
                        type="number"
                        step={10_000}
                        value={opt(row.large)}
                        onChange={(e) =>
                          patch(row.id, { large: parseOpt(e.target.value) })
                        }
                      />
                    </td>
                  </>
                )}
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => {
                      requestDelete(() => del(row.id))
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="admin-btn admin-btn--mt" onClick={add}>
        Add row
      </button>
    </section>
  )
}

export function AdminDashboard() {
  const { catalog, setGreenMenu, setPage2, setBeverages } = useMenuCatalogContext()
  const [tab, setTab] = useState<AdminTab>('')
  const [pendingDelete, setPendingDelete] = useState<{
    message: string
    onConfirm: () => void
  } | null>(null)

  const greenItems = catalog.greenMenu
  const sortedGreen = useMemo(() => {
    return [...greenItems].sort((a, b) => {
      const oa = a.sortOrder ?? 0
      const ob = b.sortOrder ?? 0
      if (oa !== ob) return oa - ob
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
  }, [greenItems])

  const patchGreen = useCallback(
    (id: string, patchRow: Partial<MenuItem>) => {
      setGreenMenu((prev) =>
        prev.map((row) => (row.id === id ? { ...row, ...patchRow } : row))
      )
    },
    [setGreenMenu]
  )

  const removeGreen = useCallback(
    (id: string) => {
      setGreenMenu((prev) => prev.filter((row) => row.id !== id))
    },
    [setGreenMenu]
  )
  const requestDelete = useCallback<RequestDelete>((onConfirm, message) => {
    setPendingDelete({
      message: message ?? 'Are you sure?',
      onConfirm,
    })
  }, [])

  const p2 = catalog.page2
  const bev = catalog.beverages
  const greenCategories = useMemo(() => {
    const set = new Set(greenItems.map((i) => i.category))
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [greenItems])

  const tabDefs = useMemo(
    () => [
      ...greenCategories.map((category) => ({
        id: `green:${encodeURIComponent(category)}`,
        label: category.toUpperCase(),
      })),
      { id: 'p2:starters', label: 'STARTERS' },
      { id: 'p2:sharing', label: 'SHARING' },
      { id: 'p2:salads', label: 'SALADS' },
      { id: 'p2:wok', label: 'WOK NOODLES' },
      { id: 'p2:bowl', label: 'BOWL' },
      { id: 'p2:signature-rolls', label: 'SIGNATURE ROLLS' },
      { id: 'p2:pizza', label: 'PIZZA' },
      { id: 'p2:burgers', label: 'BURGERS' },
      { id: 'p2:french-tacos', label: 'FRENCH TACOS' },
      { id: 'bev:black-coffee', label: 'BLACK COFFEE' },
      { id: 'bev:hot', label: 'HOT BEVERAGES' },
      { id: 'bev:blended', label: 'BLENDED DRINKS' },
      { id: 'bev:iced', label: 'ICED BEVERAGES' },
      { id: 'bev:drinks', label: 'DRINKS' },
      { id: 'bev:nargileh', label: 'NARGILEH' },
    ],
    [greenCategories]
  )

  useEffect(() => {
    if (tabDefs.length === 0) return
    if (!tabDefs.some((t) => t.id === tab)) {
      setTab(tabDefs[0].id)
    }
  }, [tab, tabDefs])

  const selectedGreenCategory = tab.startsWith('green:')
    ? decodeURIComponent(tab.slice('green:'.length))
    : null
  const greenRows = selectedGreenCategory
    ? sortedGreen.filter((row) => row.category === selectedGreenCategory)
    : []

  const addGreenItem = useCallback(() => {
    if (!selectedGreenCategory) return
    setGreenMenu((prev) => {
      const nextOrder = prev.reduce((m, i) => Math.max(m, i.sortOrder ?? 0), 0) + 10
      return [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          category: selectedGreenCategory,
          name: 'New item',
          description: '',
          price: 0,
          sortOrder: nextOrder,
        },
      ]
    })
  }, [selectedGreenCategory, setGreenMenu])

  return (
    <PinGate>
      <div className="admin-app">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          <nav className="admin-nav">
            <a
              className="admin-link"
              href="#/"
              onClick={() => {
                sessionStorage.removeItem(ADMIN_SESSION_KEY)
              }}
            >
              ← Exit Dashboard
            </a>
          </nav>
        </header>

        <div className="admin-tabs" role="tablist">
          {tabDefs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`admin-tab${tab === t.id ? ' admin-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {selectedGreenCategory ? (
          <div className="admin-tab-panel">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="admin-col-price">Price</th>
                    <th>Description</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {greenRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          className="admin-cell-input"
                          value={row.name}
                          onChange={(e) =>
                            patchGreen(row.id, { name: e.target.value })
                          }
                        />
                      </td>
                      <td className="admin-col-price">
                        <input
                          className="admin-cell-input admin-cell-input--num admin-price-input"
                          type="number"
                          step={10_000}
                          value={Number.isNaN(row.price) ? '' : row.price}
                          onChange={(e) => {
                            const v = e.target.value
                            patchGreen(row.id, {
                              price: v === '' ? 0 : Number(v),
                            })
                          }}
                        />
                      </td>
                      <td>
                        <textarea
                          className="admin-cell-textarea"
                          rows={2}
                          value={row.description ?? ''}
                          onChange={(e) =>
                            patchGreen(row.id, { description: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn--small admin-btn--danger"
                          onClick={() => {
                            requestDelete(() => removeGreen(row.id))
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="admin-btn admin-btn--mt" onClick={addGreenItem}>
              Add item
            </button>
          </div>
        ) : null}

        {tab === 'p2:starters' ? (
          <div className="admin-tab-panel">
            <AdminStartersSection
              leftRows={p2.startersLeft}
              rightRows={p2.startersRight}
              note={p2.startersNote}
              onChangeLeft={(rows) =>
                setPage2((p) => ({ ...p, startersLeft: rows }))
              }
              onChangeRight={(rows) =>
                setPage2((p) => ({ ...p, startersRight: rows }))
              }
              onChangeNote={(note) =>
                setPage2((p) => ({ ...p, startersNote: note }))
              }
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:sharing' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Sharing"
              rows={p2.sharing}
              onChange={(rows) => setPage2((p) => ({ ...p, sharing: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:salads' ? (
          <div className="admin-tab-panel admin-tab-panel--scroll">
            <AdminSaladsSection
              rows={p2.salads}
              onChange={(rows) => setPage2((p) => ({ ...p, salads: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:wok' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Wok noodles"
              rows={p2.wok}
              onChange={(rows) => setPage2((p) => ({ ...p, wok: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:bowl' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Bowl"
              rows={p2.bowl}
              onChange={(rows) => setPage2((p) => ({ ...p, bowl: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:signature-rolls' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Signature rolls"
              rows={p2.signatureRolls}
              onChange={(rows) =>
                setPage2((p) => ({ ...p, signatureRolls: rows }))
              }
              requestDelete={requestDelete}
            />
            <div className="admin-meal-upgrade">
              <h2 className="admin-block-title">Meal upgrade</h2>
              <label className="admin-inline-field">
                Extra price
                <input
                  className="admin-cell-input admin-cell-input--num"
                  type="number"
                  step={10_000}
                  value={p2.rollsMealUpgradePrice}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradePrice:
                        e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label className="admin-inline-field">
                Subtext
                <input
                  className="admin-cell-input admin-inline-input-wide"
                  value={p2.rollsMealUpgradeSubtext}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradeSubtext: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        ) : null}

        {tab === 'p2:pizza' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Pizza"
              rows={p2.pizza}
              onChange={(rows) => setPage2((p) => ({ ...p, pizza: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'p2:burgers' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="Burgers"
              rows={p2.burgers}
              onChange={(rows) => setPage2((p) => ({ ...p, burgers: rows }))}
              requestDelete={requestDelete}
            />
            <div className="admin-meal-upgrade">
              <h2 className="admin-block-title">Meal upgrade</h2>
              <label className="admin-inline-field">
                Extra price
                <input
                  className="admin-cell-input admin-cell-input--num"
                  type="number"
                  step={10_000}
                  value={p2.rollsMealUpgradePrice}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradePrice:
                        e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label className="admin-inline-field">
                Subtext
                <input
                  className="admin-cell-input admin-inline-input-wide"
                  value={p2.rollsMealUpgradeSubtext}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradeSubtext: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        ) : null}

        {tab === 'p2:french-tacos' ? (
          <div className="admin-tab-panel">
            <AdminDescSection
              title="French tacos"
              rows={p2.frenchTacos}
              onChange={(rows) =>
                setPage2((p) => ({ ...p, frenchTacos: rows }))
              }
              requestDelete={requestDelete}
            />
            <div className="admin-meal-upgrade">
              <h2 className="admin-block-title">Meal upgrade</h2>
              <label className="admin-inline-field">
                Extra price
                <input
                  className="admin-cell-input admin-cell-input--num"
                  type="number"
                  step={10_000}
                  value={p2.rollsMealUpgradePrice}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradePrice:
                        e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label className="admin-inline-field">
                Subtext
                <input
                  className="admin-cell-input admin-inline-input-wide"
                  value={p2.rollsMealUpgradeSubtext}
                  onChange={(e) =>
                    setPage2((p) => ({
                      ...p,
                      rollsMealUpgradeSubtext: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        ) : null}

        {tab === 'bev:black-coffee' ? (
          <div className="admin-tab-panel">
            <AdminBevSection
              title="Black coffee"
              rows={bev.blackCoffee}
              columns="sml"
              onChange={(rows) =>
                setBeverages((b) => ({ ...b, blackCoffee: rows }))
              }
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'bev:hot' ? (
          <div className="admin-tab-panel">
            <AdminBevSection
              title="Hot beverages"
              rows={bev.hot}
              columns="sml"
              onChange={(rows) => setBeverages((b) => ({ ...b, hot: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'bev:blended' ? (
          <div className="admin-tab-panel">
            <AdminBevSection
              title="Blended drinks"
              rows={bev.blended}
              columns="ml"
              onChange={(rows) =>
                setBeverages((b) => ({ ...b, blended: rows }))
              }
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'bev:iced' ? (
          <div className="admin-tab-panel">
            <AdminBevSection
              title="Iced beverages"
              rows={bev.iced}
              columns="ml"
              onChange={(rows) => setBeverages((b) => ({ ...b, iced: rows }))}
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'bev:drinks' ? (
          <div className="admin-tab-panel">
            <AdminSimpleSection
              title="Drinks"
              rows={bev.drinks}
              onChange={(rows) =>
                setBeverages((b) => ({ ...b, drinks: rows }))
              }
              requestDelete={requestDelete}
            />
          </div>
        ) : null}

        {tab === 'bev:nargileh' ? (
          <div className="admin-tab-panel">
            <AdminSimpleSection
              title="Nargileh"
              rows={bev.nargileh}
              onChange={(rows) =>
                setBeverages((b) => ({ ...b, nargileh: rows }))
              }
              requestDelete={requestDelete}
            />
          </div>
        ) : null}
        {pendingDelete ? (
          <div className="admin-confirm-overlay" role="dialog" aria-modal="true">
            <div className="admin-confirm-card">
              <p className="admin-confirm-text">{pendingDelete.message}</p>
              <div className="admin-confirm-actions">
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => setPendingDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger"
                  onClick={() => {
                    const action = pendingDelete.onConfirm
                    setPendingDelete(null)
                    action()
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PinGate>
  )
}
