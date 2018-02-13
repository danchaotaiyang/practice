export default {
    props: {
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            currentColumns: [],
            currentData: []
        };
    },
    methods: {
        makeColumns() {
            this.currentColumns = this.columns.map((col, index) => {
                col._sortType = 'normal';
                col._index = index;
                return col;
            });
        },
        makeData() {
            this.currentData = this.data.map((row, index) => {
                row._index = index;
                return row;
            });
        },
        handleSort(index, type) {
            const key = this.currentColumns[index].key;
            this.currentColumns.forEach((col) => {
                col._sortType = 'normal';
            });
            this.currentColumns[index]._sortType = 'asc';
            this.currentData.sort((a, b) => {
                if (type === 'asc') {
                    return a[key] > b[key] ? 1 : -1;
                } else {
                    return b[key] > a[key] ? 1 : -1;
                }
            });
        }
    },
    mounted() {
        this.makeColumns();
        this.makeData();
    },
    render(h) {
        const ths = [];
        this.currentColumns.forEach((cell, index) => {
            if (cell.sortable) {
                ths.push(h('th', [
                    h('span', cell.title),
                    h('a', {
                        class: {
                            on: cell._sortType === 'asc'
                        },
                        on: {
                            click: () => {
                                this.handleSort(index, 'asc');
                            }
                        }
                    }, '↑'),
                    h('a', {
                        class: {
                            on: cell._sortType === 'desc'
                        },
                        on: {
                            click: () => {
                                this.handleSort(index, 'desc');
                            }
                        }
                    }, '↓')
                ]));
            } else {
                ths.push(h('th', cell.title));
            }
        });

        const trs = [];
        this.currentData.forEach((row) => {
            const tds = [];
            this.currentColumns.forEach((cell) => {
                tds.push(h('td', row[cell.key]));
            });
            trs.push(h('tr', tds));
        });

        return h('table', [
            h('thead', [
                h('tr', ths)
            ]),
            h('tbody', trs)
        ]);
    },
    watch: {
        data() {
            this.makeData();
            const sortColumn = this.currentColumns.filter(col => col._sortType !== 'normal');
            if (sortColumn.length) {
                this.handleSort(sortColumn[0]._index, sortColumn[0]._sortType);
            }
        }
    }
}
