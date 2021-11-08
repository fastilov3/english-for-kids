import DataTable from 'vanilla-datatables';
import Categories from '../cards';

import storage from './../helpers/storage';

const getCategoriesList = async () => {
  return Categories;
};

const initDataTable = () => {
  const historyWords = storage.get('historyWords', {});

  const columnData = [
    {
      select: 1,

      render: function (data) {
        if (historyWords[data]) {
          return `${data} <b>(${historyWords[data].successCount || 0} / ${
            historyWords[data].errorsCount || 0
          })</b>`;
        }
        return `${data} <b>(0 / 0)</b>`;
      },
    },
  ];

  const statisticsTable = document.getElementById('statistics-table');
  const dataTable = new DataTable(statisticsTable, {
    perPage: 20,
    perPageSelect: false,
    columns: columnData,
    prevText: '<i class="material-icons">chevron_left</i></a>',
    nextText: '<i class="material-icons">chevron_right</i>',
    labels: {
      placeholder: 'Search words...',
      noRows: 'No words to display',
      info: 'Showing {start} to {end} of {rows} words (Page {page} of {pages} pages)',
    },
  });

  dataTable.on('datatable.init', () => {
    document.querySelector('.dataTable-pagination').classList.add('pagination');
  });

  return dataTable;
};

let Statistics = {
  render: async () => {
    const historyWords = storage.get('historyWords', {});
    let categories = await getCategoriesList();
    let view = /*html*/ `
            <section id="statistics-section" class="section statistics-section">
              <div class="statistics-header">
                <h1 class="statistics-title">Statistics</h1>
                <div class="statistics-controls">
                  <a href="#/difficult-words" class="waves-effect waves-light btn">Repeat difficult words</a>
                  <a id="statistics-refresh" class="waves-effect waves-light btn red"><i class="material-icons left">refresh</i>Reset</a>
                </div>
              </div>
              <table id="statistics-table" class="statistics-table striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Word (сorrectly / errors)</th>
                      <th>Translate</th>
                      <th>Clicks (TRAINING)</th>
                      <th>Сorrectly</th>
                      <th>Errors</th>
                      <th>Percent (сorr. / err. * 100)</th>
                    </tr>
                  </thead>
                  ${categories
                    .map((category) =>
                      category.list
                        .map(({ word, translation }) => {
                          let percent = '';

                          if (
                            historyWords[word] &&
                            historyWords[word].successCount &&
                            historyWords[word].errorsCount
                          ) {
                            percent =
                              Math.round(
                                (historyWords[word].successCount / historyWords[word].errorsCount) *
                                  100,
                              ) + '%';
                          }

                          if (
                            historyWords[word] &&
                            historyWords[word].successCount &&
                            !historyWords[word].errorsCount
                          )
                            percent = '100%';

                          return `
                          <tr>
                              <td>${category.title}</td>
                              <td>${word}</td>
                              <td>${translation}</td>
                              <td>${historyWords[word] ? historyWords[word].count || 0 : 0}</td>
                              <td>${
                                historyWords[word] ? historyWords[word].successCount || 0 : 0
                              }</td>
                              <td>${
                                historyWords[word] ? historyWords[word].errorsCount || 0 : 0
                              }</td>
                              <td>${percent || '0%'}</td>
                          </tr>
                      `;
                        })
                        .join('\n '),
                    )
                    .join('\n ')}
                </table>
            </section>
        `;
    return view;
  },
  after_render: async () => {
    let dataTable = initDataTable();

    document.getElementById('statistics-refresh').addEventListener('click', async () => {
      const isConfirm = confirm('Are you sure?');
      if (!isConfirm) return;

      dataTable.destroy();
      storage.set('historyWords', {});
      document.getElementById('page_container').innerHTML = await Statistics.render();
      dataTable = initDataTable();
    });
  },
};
export default Statistics;
