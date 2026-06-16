"use client";

type CommunicationRow = {
  role: string;
  name: string;
  phone: string;
};

type MaterialsRow = {
  item: string;
  quantity: string;
  location: string;
  owner: string;
  notes: string;
};

export function AttachmentPanel({
  appendixCatalog,
  communicationList,
  materialsList,
  communicationRows,
  materialsRows,
  onCommunicationRowsChange,
  onMaterialsRowsChange
}: {
  appendixCatalog: string;
  communicationList: string;
  materialsList: string;
  communicationRows: CommunicationRow[];
  materialsRows: MaterialsRow[];
  onCommunicationRowsChange: (rows: CommunicationRow[]) => void;
  onMaterialsRowsChange: (rows: MaterialsRow[]) => void;
}) {
  function updateContacts(nextRows: CommunicationRow[]) {
    onCommunicationRowsChange(nextRows);
  }

  function updateMaterials(nextRows: MaterialsRow[]) {
    onMaterialsRowsChange(nextRows);
  }

  return (
    <section>
      <h2>附件模块</h2>
      <h3>附图附表目录</h3>
      <pre>{appendixCatalog}</pre>

      <h3>应急通讯录</h3>
      <pre>{communicationList}</pre>
      <table>
        <thead>
          <tr>
            <th>岗位</th>
            <th>姓名/说明</th>
            <th>电话</th>
          </tr>
        </thead>
        <tbody>
          {communicationRows.map((row, index) => (
            <tr key={`contact-${index}`}>
              <td>
                <input
                  aria-label={`通讯录岗位-${index + 1}`}
                  value={row.role}
                  onChange={(event) =>
                    updateContacts(
                      communicationRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, role: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`通讯录姓名-${index + 1}`}
                  value={row.name}
                  onChange={(event) =>
                    updateContacts(
                      communicationRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, name: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`通讯录电话-${index + 1}`}
                  value={row.phone}
                  onChange={(event) =>
                    updateContacts(
                      communicationRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, phone: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>应急物资清单</h3>
      <pre>{materialsList}</pre>
      <table>
        <thead>
          <tr>
            <th>物资名称</th>
            <th>数量</th>
            <th>存放位置</th>
            <th>责任人</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {materialsRows.map((row, index) => (
            <tr key={`material-${index}`}>
              <td>
                <input
                  aria-label={`物资名称-${index + 1}`}
                  value={row.item}
                  onChange={(event) =>
                    updateMaterials(
                      materialsRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, item: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`物资数量-${index + 1}`}
                  value={row.quantity}
                  onChange={(event) =>
                    updateMaterials(
                      materialsRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, quantity: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`物资位置-${index + 1}`}
                  value={row.location}
                  onChange={(event) =>
                    updateMaterials(
                      materialsRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, location: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`物资责任人-${index + 1}`}
                  value={row.owner}
                  onChange={(event) =>
                    updateMaterials(
                      materialsRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, owner: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  aria-label={`物资备注-${index + 1}`}
                  value={row.notes}
                  onChange={(event) =>
                    updateMaterials(
                      materialsRows.map((currentRow, currentIndex) =>
                        currentIndex === index
                          ? { ...currentRow, notes: event.target.value }
                          : currentRow
                      )
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
