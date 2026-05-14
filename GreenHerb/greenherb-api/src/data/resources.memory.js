const stores = {
  herbs: [
    {
      id: 1,
      name: "Manjericao",
      scientificName: "Ocimum basilicum",
      idealTemperatureC: 22,
      idealHumidityPercent: 60
    }
  ],
  plans: [
    {
      id: 1,
      name: "Plano de cultivo base",
      herbId: 1,
      durationDays: 45
    }
  ],
  batches: [
    {
      id: 1,
      herbId: 1,
      planId: 1,
      code: "GH-BATCH-001",
      status: "ATIVO"
    }
  ],
  tasks: [
    {
      id: 1,
      batchId: 1,
      title: "Verificar irrigacao",
      status: "PENDENTE"
    }
  ],
  measurements: [
    {
      id: 1,
      batchId: 1,
      temperatureC: 22.4,
      humidityPercent: 58,
      measuredAt: "2026-05-08T09:00:00.000Z"
    }
  ],
  alerts: [
    {
      id: 1,
      batchId: 1,
      type: "HUMIDADE_BAIXA",
      severity: "MEDIA",
      active: true
    }
  ],
  automation: [
    {
      id: 1,
      name: "Irrigacao automatica",
      enabled: true,
      rule: "humidityPercent < 45"
    }
  ],
  reports: [
    {
      id: 1,
      title: "Relatorio semanal",
      type: "SEMANAL",
      generatedAt: "2026-05-08T09:30:00.000Z"
    }
  ],
  audit: [
    {
      id: 1,
      actor: "system",
      action: "SPRINT_1_BOOTSTRAP",
      createdAt: "2026-05-08T09:30:00.000Z"
    }
  ]
};

const counters = Object.keys(stores).reduce((accumulator, resourceName) => {
  const ids = stores[resourceName].map((item) => item.id);
  accumulator[resourceName] = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  return accumulator;
}, {});

function ensureStore(resourceName) {
  if (!stores[resourceName]) {
    throw new Error(`Recurso em memoria nao configurado: ${resourceName}`);
  }
}

function listItems(resourceName) {
  ensureStore(resourceName);
  return stores[resourceName];
}

function getItemById(resourceName, id) {
  ensureStore(resourceName);
  const numericId = Number(id);
  return stores[resourceName].find((item) => item.id === numericId) || null;
}

function createItem(resourceName, payload) {
  ensureStore(resourceName);

  const now = new Date().toISOString();
  const item = {
    ...payload,
    id: counters[resourceName],
    createdAt: now,
    updatedAt: now
  };

  counters[resourceName] += 1;
  stores[resourceName].push(item);

  return item;
}

function updateItem(resourceName, id, payload) {
  ensureStore(resourceName);

  const numericId = Number(id);
  const index = stores[resourceName].findIndex((item) => item.id === numericId);

  if (index === -1) {
    return null;
  }

  stores[resourceName][index] = {
    ...stores[resourceName][index],
    ...payload,
    id: numericId,
    updatedAt: new Date().toISOString()
  };

  return stores[resourceName][index];
}

function deleteItem(resourceName, id) {
  ensureStore(resourceName);

  const numericId = Number(id);
  const index = stores[resourceName].findIndex((item) => item.id === numericId);

  if (index === -1) {
    return false;
  }

  stores[resourceName].splice(index, 1);
  return true;
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
