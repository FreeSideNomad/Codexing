import { create } from 'zustand'
import type { KitItem, Bundle, PastOrder, EquipmentCategory, ShootType, BundleTier } from '@/types'
import { equipment } from '@/data/equipment'
import { bundles } from '@/data/bundles'
import { pastOrders } from '@/data/orders'

interface CatalogState {
  equipment: KitItem[]
  bundles: Bundle[]
  pastOrders: PastOrder[]
  getEquipmentByCategory: (category: EquipmentCategory) => KitItem[]
  getBundlesByShootType: (shootType: ShootType) => Bundle[]
  getBundlesByTier: (tier: BundleTier) => Bundle[]
  getEquipmentById: (id: string) => KitItem | undefined
  getBundleById: (id: string) => Bundle | undefined
  getOrderById: (id: string) => PastOrder | undefined
}

export const useCatalogStore = create<CatalogState>()(() => ({
  equipment,
  bundles,
  pastOrders,
  getEquipmentByCategory: (category) => equipment.filter((e) => e.category === category),
  getBundlesByShootType: (shootType) => bundles.filter((b) => b.shootType === shootType),
  getBundlesByTier: (tier) => bundles.filter((b) => b.tier === tier),
  getEquipmentById: (id) => equipment.find((e) => e.id === id),
  getBundleById: (id) => bundles.find((b) => b.id === id),
  getOrderById: (id) => pastOrders.find((o) => o.id === id),
}))
